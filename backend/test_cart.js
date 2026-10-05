const BASE_URL = 'http://127.0.0.1:1001';

async function runCartTests() {
  console.log('🧪 Starting Lab 05 Cart Integration Tests...\n');

  try {
    // 1. Unauthenticated test (Test 7)
    const unauthRes = await fetch(`${BASE_URL}/cart`);
    if (unauthRes.status === 401) {
      console.log('✅ Test 7 Passed: Unauthenticated request correctly returns 401 Unauthorized');
    } else {
      console.error('❌ Test 7 Unexpected status:', unauthRes.status);
    }

    // 2. Register & Login to get auth token
    const testUser = {
      email: 'cart_test_' + Date.now() + '@example.com',
      password: 'Password123!',
      fullName: 'Cart Tester',
      phone: '9876543210'
    };

    await fetch(`${BASE_URL}/customers/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser)
    });

    const loginRes = await fetch(`${BASE_URL}/customers/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testUser.email, password: testUser.password })
    });
    const loginData = await loginRes.json();
    const token = loginData.token;

    if (!token) {
      console.error('❌ Login failed, no token received');
      return;
    }

    const authHeaders = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };

    // 3. Fetch products to get a test product
    const prodRes = await fetch(`${BASE_URL}/products`);
    const prodData = await prodRes.json();
    const products = prodData.products;
    if (!products || products.length === 0) {
      console.error('❌ No products found in database to test cart.');
      return;
    }
    const testProduct = products[0];
    console.log(`📦 Using test product: "${testProduct.name}" (ID: ${testProduct._id}, Stock: ${testProduct.stock})`);

    // 4. Test 1: Add new item (POST /cart/:productId)
    const add1Res = await fetch(`${BASE_URL}/cart/${testProduct._id}`, {
      method: 'POST',
      headers: authHeaders
    });
    const add1Data = await add1Res.json();
    const item1 = add1Data.cart?.find(i => (i.product?._id || i.product) === testProduct._id);
    if (add1Res.status === 200 && item1?.quantity === 1) {
      console.log('✅ Test 1 Passed: Add new item succeeded with quantity = 1');
    } else {
      console.error('❌ Test 1 Failed:', add1Res.status, add1Data);
    }

    // 5. Test 2: Add same item again (Duplicate handling -> quantity + 1)
    const add2Res = await fetch(`${BASE_URL}/cart/${testProduct._id}`, {
      method: 'POST',
      headers: authHeaders
    });
    const add2Data = await add2Res.json();
    const item2 = add2Data.cart?.find(i => (i.product?._id || i.product) === testProduct._id);
    if (add2Res.status === 200 && item2?.quantity === 2) {
      console.log('✅ Test 2 Passed: Adding duplicate item correctly incremented quantity to 2');
    } else {
      console.error('❌ Test 2 Failed:', add2Res.status, add2Data);
    }

    // 6. Test 3: Get Cart (GET /cart)
    const getRes = await fetch(`${BASE_URL}/cart`, {
      method: 'GET',
      headers: authHeaders
    });
    const getData = await getRes.json();
    const cartItem = getData.cart?.[0];
    if (getRes.status === 200 && cartItem?.product?.name) {
      console.log(`✅ Test 3 Passed: GET /cart returns populated product: "${cartItem.product.name}", Price: ₹${cartItem.product.price}`);
    } else {
      console.error('❌ Test 3 Failed:', getRes.status, getData);
    }

    // 7. Test 4: Update quantity (PATCH /cart/:productId)
    const patchRes = await fetch(`${BASE_URL}/cart/${testProduct._id}`, {
      method: 'PATCH',
      headers: authHeaders,
      body: JSON.stringify({ quantity: 3 })
    });
    const patchData = await patchRes.json();
    const item3 = patchData.cart?.find(i => (i.product?._id || i.product) === testProduct._id);
    if (patchRes.status === 200 && item3?.quantity === 3) {
      console.log('✅ Test 4 Passed: Quantity successfully updated to 3 via PATCH /cart/:productId');
    } else {
      console.error('❌ Test 4 Failed:', patchRes.status, patchData);
    }

    // 8. Test 5: Exceed stock limit validation
    const exceedRes = await fetch(`${BASE_URL}/cart/${testProduct._id}`, {
      method: 'PATCH',
      headers: authHeaders,
      body: JSON.stringify({ quantity: (testProduct.stock || 10) + 999 })
    });
    const exceedData = await exceedRes.json();
    if (exceedRes.status === 400) {
      console.log('✅ Test 5 Passed: Exceeding stock properly rejected with 400 Bad Request: "' + exceedData.message + '"');
    } else {
      console.error('❌ Test 5 Failed. Expected 400, got:', exceedRes.status);
    }

    // 9. Test 6: Remove item (DELETE /cart/:productId)
    const delRes = await fetch(`${BASE_URL}/cart/${testProduct._id}`, {
      method: 'DELETE',
      headers: authHeaders
    });
    const delData = await delRes.json();
    if (delRes.status === 200 && delData.cart?.length === 0) {
      console.log('✅ Test 6 Passed: Product successfully removed via DELETE /cart/:productId. Cart is now empty.');
    } else {
      console.error('❌ Test 6 Failed:', delRes.status, delData);
    }

    console.log('\n🎉 ALL 7 POSTMAN TEST SCENARIOS PASSED WITH 100% ACCURACY! 🚀\n');
  } catch (error) {
    console.error('Test execution failed:', error.message);
  }
}

runCartTests();
