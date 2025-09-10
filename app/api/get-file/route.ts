import fs from 'fs';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';

// 1. 核心配置：仅允许访问指定根目录下的 JSON 文件（防止越权）
const ALLOWED_ROOT_DIR = 'blockchain'; // 你的 JSON 文件所在根目录（如项目根目录下的 docs/）
const ALLOWED_FILE_EXT = '.json'; // 强制只处理 JSON 文件，避免其他类型文件风险


/**
 * 动态获取 JSON 文件内容（直接返回 JSON 本身，无外层包裹）
 * @param req 请求对象（携带动态文件路径参数）
 * @returns 成功：JSON 文件内容；失败：{ error: 错误信息 } + 对应状态码
 */
export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    // 2. 解析请求参数：从查询参数中获取动态 JSON 路径（如 ?file=user/list.json）
    const fileRelativePath = req.nextUrl.searchParams.get('file');

    // 2.1 校验参数是否存在
    if (!fileRelativePath) {
      return NextResponse.json(
        { error: '缺少参数：file（需指定 JSON 文件路径，如 ?file=user/list.json）' },
        { status: 400 } // 400：参数错误
      );
    }

    // 2.2 校验文件后缀（仅允许 JSON）
    if (path.extname(fileRelativePath) !== ALLOWED_FILE_EXT) {
      return NextResponse.json(
        { error: `仅支持 ${ALLOWED_FILE_EXT} 类型文件` },
        { status: 400 }
      );
    }


    // 3. 安全处理：拼接路径 + 防止路径遍历攻击（核心！）
    // 3.1 拼接项目根目录下的绝对路径
    const absoluteFilePath = path.join(process.cwd(), ALLOWED_ROOT_DIR, fileRelativePath);
    // 3.2 解析最终路径（处理 ../ 等恶意路径）
    const resolvedFilePath = path.resolve(absoluteFilePath);
    // 3.3 验证路径是否在允许的根目录内（禁止越权访问）
    const allowedRootAbsPath = path.resolve(process.cwd(), ALLOWED_ROOT_DIR);
    
    if (!resolvedFilePath.startsWith(allowedRootAbsPath)) {
      return NextResponse.json(
        { error: '禁止访问：路径超出允许范围（存在安全风险）' },
        { status: 403 } // 403：权限拒绝
      );
    }


    // 4. 读取并解析 JSON 文件
    // 4.1 读取文件内容（UTF-8 编码）
    const fileContent = fs.readFileSync(resolvedFilePath, 'utf8');
    // 4.2 解析 JSON（失败时抛出错误）
    const jsonContent = JSON.parse(fileContent);


    // 5. 直接返回 JSON 内容（无任何外层包裹！）
    return NextResponse.json(jsonContent);


  } catch (error: unknown) {
    // 6. 错误分类处理（返回明确的错误信息 + 状态码）
    let errorMsg = 'JSON 文件读取/解析失败';
    let statusCode = 500; // 默认：服务器错误

    if (error instanceof Error) {
      const nodeError = error as NodeJS.ErrnoException;
      // 根据错误码精准判断
      switch (nodeError.code) {
        case 'ENOENT':
          errorMsg = '指定的 JSON 文件不存在';
          statusCode = 404; // 404：文件未找到
          break;
        case 'EACCES':
          errorMsg = '无权限读取该 JSON 文件';
          statusCode = 403; // 403：权限拒绝
          break;
        case 'EISDIR':
          errorMsg = '指定路径是目录，不是 JSON 文件';
          statusCode = 400; // 400：参数错误
          break;
        default:
          // 区分 "JSON 解析错误" 和 "其他错误"
          if (error.message.includes('Unexpected token')) {
            errorMsg = 'JSON 文件格式错误（解析失败）';
            statusCode = 400;
          } else {
            errorMsg = `服务器错误：${error.message}`;
          }
      }
    }

    // 错误时返回 { error: 信息 } 结构（便于前端捕获）
    return NextResponse.json({ error: errorMsg }, { status: statusCode });
  }
}