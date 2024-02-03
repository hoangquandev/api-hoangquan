bạn là backend developer. tôi cần xây dựng dự án api với multi target sử dụng expressjs và mongodb với require là cleancode và split code. chi tiết về dự án: tôi sẽ là admin toàn quyền quản lý, hệ thống sẽ chia ra:
1. của hàng: bán khóa học, template và source code. phần này sẽ dùng cho user là người mua hàng online.
2.  tôi  cung cấp dịch vụ lập trình web cho khách hàng. nên phần này sẽ gồm todo list cho tôi, kanban( quản lý task) hoặc gì đó để cho khách hàng theo dõi quá trình và thêm task cho tôi. và tôi muốn quản lý khách hàng và dự án.
3. phần này danh cho học viên của tôi. tôi sẽ quản lý học viên và phần này sẽ có thêm api ( dự án api nhỏ) được tích hợp trong dự án này để học viên sử dụng cho web dự án.
4 tôi là admin toàn quyền.
đó là những yêu cầu của dự án.

/project-root
|-- .env
|-- server.js
|-- /src
    |-- app.js
    |-- /config
    |   |-- db.js
    |
    |-- /api
    |   |-- /v1
    |   |   |-- /models
    |   |   |   |-- course.js
    |   |   |   |-- template.js
    |   |   |   |-- sourceCode.js
    |   |   |   |-- user.js
    |   |   |   |-- task.js
    |   |   |   |-- project.js
    |   |   |   |-- student.js
    |   |   |
    |   |   |-- /routes
    |   |   |   |-- shopRoutes.js
    |   |   |   |-- serviceRoutes.js
    |   |   |   |-- studentRoutes.js
    |   |   |   |-- adminRoutes.js
    |   |   |
    |   |   |-- /controllers
    |   |   |   |-- shopController.js
    |   |   |   |-- serviceController.js
    |   |   |   |-- studentController.js
    |   |   |   |-- adminController.js
    |   |   |
    |   |   |-- /middlewares
    |   |       |-- authMiddleware.js
    |   |       |-- errorMiddleware.js
    |   |
    |   |-- /v2
    |       // Cấu trúc tương tự v1 cho phiên bản API mới
    |
    |-- /middlewares
    |   |-- authMiddleware.js
    |   |-- errorMiddleware.js
    |
    |-- /utils
        |-- apiFeatures.js
        |-- errorHandler.js
|
|-- package.json
|-- .gitignore
|-- README.md
