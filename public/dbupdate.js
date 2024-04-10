document.getElementById("addItemForm").addEventListener("submit", function(event) {
    event.preventDefault(); // 阻止表单提交的默认行为
  
    // 获取表单中的值
    var itemName = document.getElementById("itemName").value;
    var itemPrice = document.getElementById("itemPrice").value;
  
    // 创建一个 XMLHttpRequest 对象
    var xhttp = new XMLHttpRequest();
  
    // 设置 POST 请求的 URL
    xhttp.open("POST", "add_item.php", true);
  
    // 设置请求头
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  
    // 处理响应
    xhttp.onreadystatechange = function() {
      if (this.readyState === 4 && this.status === 200) {
        // 处理成功响应
        alert("Item added successfully!");
        document.getElementById("addItemForm").reset(); // 重置表单
      }
    };
  
    // 发送 POST 请求
    xhttp.send("itemName=" + encodeURIComponent(itemName) + "&itemPrice=" + encodeURIComponent(itemPrice));
  });