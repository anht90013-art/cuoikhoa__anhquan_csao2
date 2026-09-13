// JavaScript đơn giản nhất cho đăng ký và đăng nhập
// Code ngắn gọn, dễ hiểu

// Hàm hiển thị thông báo
function hienThiThongBao(noiDung) {
    let thongBao = document.getElementById('thongbao');
    thongBao.innerHTML = noiDung;
}

// Hàm đăng ký
function dangKy() { 
    // Lấy dữ liệu từ form đăng ký
    let username = document.getElementById('username').value;
    let password = document.getElementById('password').value;

    
    // Kiểm tra cơ bản
    if (!username || !password ) {
        hienThiThongBao('Vui lòng điền đầy đủ thông tin!');
        return;
    } 
    
    
    // Lấy danh sách người dùng (đơn giản nhất)
    let users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Kiểm tra tên đã tồn tại
    let daTonTai = false;
    for (let i = 0; i < users.length; i++) {
        if (users[i].username === username) {
            daTonTai = true;
            break;
        }
    }
    
    if (daTonTai) {
        hienThiThongBao('Tên đăng nhập đã tồn tại!');
        return;
    }
    
    // Thêm người dùng mới
    users.push({username, password});
    localStorage.setItem('users', JSON.stringify(users));
    
    hienThiThongBao('Đăng ký thành công!');
}

// Hàm đăng nhập
function dangNhap() {
    let username = document.getElementById('username').value;
    let password = document.getElementById('password').value;
    
    if (!username || !password) {
        hienThiThongBao('Vui lòng điền đầy đủ thông tin!');
        return;
    }
    
    // Lấy danh sách người dùng
    let users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Tìm người dùng
    let user = null;
    for (let i = 0; i < users.length; i++) {
        if (users[i].username === username && users[i].password === password) {
            user = users[i];
            break;
        }
    }
    
    if (user) {
        hienThiThongBao('Đăng nhập thành công!');
        localStorage.setItem('currentUser', username);
        window.location.href = 'mainpage.html';
    } else {
        hienThiThongBao('Sai tên đăng nhập hoặc mật khẩu!');
    }
}
