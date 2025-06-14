# Sử dụng image Node.js chính thức
FROM node:18

# Tạo thư mục làm việc trong container
WORKDIR /app

# Copy package.json và cài đặt
COPY package.json .
RUN npm install

# Copy dbsetup.js vào container
COPY dbsetup.js .

# Chạy script thiết lập database (chỉ chạy 1 lần khi build)
RUN node dbsetup.js

# Copy mã nguồn vào container
COPY . .

# Mở cổng 8000
EXPOSE 8000

# Lệnh để chạy ứng dụng
CMD ["npm", "start"]