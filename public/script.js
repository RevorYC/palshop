// 假设有一个名为 "data" 的数组，包含要展示的数据
var data = [
    { name: 'John', age: 25, city: 'New York' },
    { name: 'Jane', age: 30, city: 'London' },
    { name: 'Bob', age: 35, city: 'Paris' }
  ];
// var data = results;
//   var data=results;

  // 获取表格容器元素
  var tableContainer = document.getElementById('tableContainer');
  
  // 创建表格元素
  var table = document.createElement('table');
  
  // 创建表头行
  var thead = document.createElement('thead');
  var headerRow = document.createElement('tr');
  
  // 遍历数据的第一个对象，生成表头列
  for (var key in data[0]) {
    var headerCell = document.createElement('th');
    headerCell.textContent = key;
    headerRow.appendChild(headerCell);
  }
  
  // 将表头行添加到表头部分
  thead.appendChild(headerRow);
  
  // 将表头部分添加到表格
  table.appendChild(thead);
  
  // 创建表体部分
  var tbody = document.createElement('tbody');
  
  // 遍历数据，生成每一行的数据列
  data.forEach(function (item) {
    var row = document.createElement('tr');
  
    for (var key in item) {
      var cell = document.createElement('td');
      cell.textContent = item[key];
      row.appendChild(cell);
    }
    
    tbody.appendChild(row);

    
  });
  
  // 将表体部分添加到表格
  table.appendChild(tbody);
  
  // 将表格添加到容器中
  tableContainer.appendChild(table);


  
//   var arrayContainer = document.getElementById('arrayContainer');
//   var arrayHTML = '';
  
//   data.forEach(function(item) {
//     arrayHTML += '<p>' + JSON.stringify(item) + '</p>';
//   });
  
//   arrayContainer.innerHTML = arrayHTML;

// data.forEach(product => {
//   // 创建商品项元素
//   const productItem = document.createElement('div');
//   productItem.className = 'product-item';

//   // 创建商品序列元素
//   const productId = document.createElement('p');
//   productId.textContent = product.pid;
//   productItem.appendChild(productId);

//   // // 创建商品图片元素
//   // const productImage = document.createElement('img');
//   // productImage.src = product.image;
//   // productItem.appendChild(productImage);

//   // 创建商品名称元素
//   const productName = document.createElement('h3');
//   productName.textContent = product.name;
//   productItem.appendChild(productName);


//   // 创建商品描述元素
//   const productDes = document.createElement('p');
//   productDes.textContent = product.des;
//   productItem.appendChild(productDes);

//   // 创建商品价格元素
//   // const productPrice = document.createElement('p');
//   // productPrice.textContent = `$${product.price.toFixed(2)}`;
//   // productItem.appendChild(productPrice);

//   // 将商品项添加到商品容器中
//   productContainer.appendChild(productItem);
// });