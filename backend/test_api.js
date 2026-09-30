const http = require('http');

const request = (path, method = 'GET', body = null) => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: '127.0.0.1',
      port: 1001,
      path,
      method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, body: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });

    req.on('error', reject);

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
};

const runTests = async () => {
  console.log('--- RUNNING LAB 03 BACKEND API TESTS ---');

  // Test 1: GET /products
  const res1 = await request('/products');
  console.log('1. GET /products -> Status:', res1.status, 'Count:', res1.body.count);

  // Test 2: Search GET /products?search=keyboard
  const res2 = await request('/products?search=keyboard');
  console.log('2. Search "keyboard" -> Count:', res2.body.count, 'Found:', res2.body.products[0]?.name);

  // Test 3: Category filter GET /products?category=Electronics
  const res3 = await request('/products?category=Electronics');
  console.log('3. Category "Electronics" -> Count:', res3.body.count);

  // Test 4: Combined search and category
  const res4 = await request('/products?search=headphones&category=Electronics');
  console.log('4. Combined filter -> Count:', res4.body.count, 'Found:', res4.body.products[0]?.name);

  // Test 5: Sorting
  const res5Asc = await request('/products?sort=price_asc');
  const res5Desc = await request('/products?sort=price_desc');
  console.log('5. Sort price_asc min price:', res5Asc.body.products[0]?.price, 'price_desc max price:', res5Desc.body.products[0]?.price);

  // Test 6: Single product GET /products/:id
  const sampleId = res1.body.products[0]._id;
  const res6 = await request(`/products/${sampleId}`);
  console.log('6. GET /products/:id -> Status:', res6.status, 'Product:', res6.body.product?.name);

  // Test 7: Invalid ID -> 400
  const res7 = await request('/products/invalid_id_123');
  console.log('7. Invalid ID -> Status:', res7.status, 'Message:', res7.body.message);

  // Test 8: Non-existent ID -> 404
  const res8 = await request('/products/66d123abc456000000000000');
  console.log('8. Not found ID -> Status:', res8.status, 'Message:', res8.body.message);

  // Test 9: Create Product Missing Field -> 400
  const res9 = await request('/products', 'POST', { name: 'Incomplete' });
  console.log('9. Missing field POST -> Status:', res9.status, 'Message:', res9.body.message);

  // Test 10: Create Product Invalid Price -> 400
  const res10 = await request('/products', 'POST', {
    name: 'Invalid Price Item',
    description: 'Desc',
    price: -50,
    category: 'Electronics',
    image: 'http://img.jpg',
    stock: 5
  });
  console.log('10. Invalid price POST -> Status:', res10.status, 'Message:', res10.body.message);

  // Test 11: Create Product Invalid Stock -> 400
  const res11 = await request('/products', 'POST', {
    name: 'Invalid Stock Item',
    description: 'Desc',
    price: 100,
    category: 'Electronics',
    image: 'http://img.jpg',
    stock: -2
  });
  console.log('11. Invalid stock POST -> Status:', res11.status, 'Message:', res11.body.message);

  // Test 12: Create Product Success -> 201
  const res12 = await request('/products', 'POST', {
    name: 'Lab Test Gadget',
    description: 'A test gadget for checking creation API.',
    price: 999,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600',
    stock: 8
  });
  console.log('12. Valid product creation POST -> Status:', res12.status, 'Created ID:', res12.body.product?._id);

  console.log('--- ALL BACKEND TESTS COMPLETED SUCCESSFULLY ---');
};

runTests();
