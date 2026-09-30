const BASE_URL = 'http://localhost:1001';

async function runTests() {
  console.log('=== STARTING LAB 04 WISHLIST TEST SUITE ===\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${message}`);
      failed++;
    }
  }

  try {
    // 0. Fetch a real product from database
    const productsRes = await fetch(`${BASE_URL}/products`).then(r => r.json());
    const testProduct = productsRes.products[0];
    const testProductId = testProduct._id;
    console.log(`Found test product: "${testProduct.name}" (ID: ${testProductId})\n`);

    // TEST 5: Unauthenticated request should return 401
    console.log('--- Test 5: Unauthenticated Requests (Expected: 401) ---');
    const unauthGet = await fetch(`${BASE_URL}/wishlist`);
    assert(unauthGet.status === 401, `GET /wishlist without token returned ${unauthGet.status}`);

    const unauthPost = await fetch(`${BASE_URL}/wishlist/${testProductId}`, { method: 'POST' });
    assert(unauthPost.status === 401, `POST /wishlist/:productId without token returned ${unauthPost.status}`);

    // Register & Login a customer to get auth token
    const uniqueEmail = `wishlist_tester_${Date.now()}@example.com`;
    await fetch(`${BASE_URL}/customers/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: 'Wishlist Tester',
        email: uniqueEmail,
        password: 'password123',
        phone: '9876543210'
      })
    });

    const loginRes = await fetch(`${BASE_URL}/customers/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: uniqueEmail,
        password: 'password123'
      })
    }).then(r => r.json());

    const token = loginRes.token;
    const authHeaders = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
    console.log(`\nLogged in as ${uniqueEmail}, got auth token.\n`);

    // Edge Case: Invalid product ID (400)
    console.log('--- Edge Case: Invalid Product ID (Expected: 400) ---');
    const invalidIdRes = await fetch(`${BASE_URL}/wishlist/invalidId123`, {
      method: 'POST',
      headers: authHeaders
    });
    const invalidIdData = await invalidIdRes.json();
    assert(invalidIdRes.status === 400, `POST with invalid ID returned 400 (${invalidIdData.message})`);

    // Edge Case: Non-existent product ID (404)
    console.log('\n--- Edge Case: Non-Existent Product (Expected: 404) ---');
    const fakeId = '65f000000000000000000000';
    const nonExistentRes = await fetch(`${BASE_URL}/wishlist/${fakeId}`, {
      method: 'POST',
      headers: authHeaders
    });
    const nonExistentData = await nonExistentRes.json();
    assert(nonExistentRes.status === 404, `POST with non-existent product returned 404 (${nonExistentData.message})`);

    // Initial Wishlist State (Empty)
    console.log('\n--- Initial Wishlist State ---');
    const emptyRes = await fetch(`${BASE_URL}/wishlist`, { headers: authHeaders });
    const emptyData = await emptyRes.json();
    assert(emptyRes.status === 200 && emptyData.count === 0 && emptyData.wishlist.length === 0, 'Initial wishlist is empty (count 0)');

    // TEST 1: Add product to wishlist (200/201)
    console.log('\n--- Test 1: Add Product To Wishlist (Expected: 200) ---');
    const addRes = await fetch(`${BASE_URL}/wishlist/${testProductId}`, {
      method: 'POST',
      headers: authHeaders
    });
    const addData = await addRes.json();
    assert(addRes.status === 200 && addData.success === true, `Product added successfully: "${addData.message}"`);

    // TEST 2: Duplicate add should return 409 Conflict
    console.log('\n--- Test 2: Duplicate Prevention (Expected: 409 Conflict) ---');
    const duplicateRes = await fetch(`${BASE_URL}/wishlist/${testProductId}`, {
      method: 'POST',
      headers: authHeaders
    });
    const duplicateData = await duplicateRes.json();
    assert(duplicateRes.status === 409, `Duplicate addition returned 409 Conflict (${duplicateData.message})`);

    // TEST 3: Get current user wishlist with populate
    console.log('\n--- Test 3: Get Wishlist (with populate) ---');
    const getRes = await fetch(`${BASE_URL}/wishlist`, { headers: authHeaders });
    const getData = await getRes.json();
    assert(getRes.status === 200, 'GET /wishlist returned 200');
    assert(getData.count === 1, `Wishlist count is 1 (Got ${getData.count})`);
    const savedProduct = getData.wishlist[0];
    assert(savedProduct._id.toString() === testProductId.toString(), `Correct product ID saved: ${savedProduct._id}`);
    assert(savedProduct.name === testProduct.name, `Populated product name matches: "${savedProduct.name}"`);
    assert(savedProduct.price === testProduct.price, `Populated product price matches: ₹${savedProduct.price}`);
    assert(savedProduct.category === testProduct.category, `Populated product category matches: ${savedProduct.category}`);

    // TEST 4: Remove product from wishlist
    console.log('\n--- Test 4: Remove Product From Wishlist (Expected: 200) ---');
    const deleteRes = await fetch(`${BASE_URL}/wishlist/${testProductId}`, {
      method: 'DELETE',
      headers: authHeaders
    });
    const deleteData = await deleteRes.json();
    assert(deleteRes.status === 200 && deleteData.success === true, `Product removed: "${deleteData.message}"`);

    // Edge Case: Removing product not in wishlist should return 404
    console.log('\n--- Edge Case: Remove Non-Existent Wishlist Item (Expected: 404) ---');
    const secondDeleteRes = await fetch(`${BASE_URL}/wishlist/${testProductId}`, {
      method: 'DELETE',
      headers: authHeaders
    });
    const secondDeleteData = await secondDeleteRes.json();
    assert(secondDeleteRes.status === 404, `Removing item not in wishlist returned 404 (${secondDeleteData.message})`);

    // Verify wishlist is empty again
    const finalGetRes = await fetch(`${BASE_URL}/wishlist`, { headers: authHeaders }).then(r => r.json());
    assert(finalGetRes.count === 0, 'Wishlist count returned to 0 after removal');

    // Bonus: Toggle functionality test
    console.log('\n--- Bonus Test: Wishlist Toggle (PATCH /wishlist/:id/toggle) ---');
    const toggleAddRes = await fetch(`${BASE_URL}/wishlist/${testProductId}/toggle`, {
      method: 'PATCH',
      headers: authHeaders
    });
    const toggleAddData = await toggleAddRes.json();
    assert(toggleAddRes.status === 200 && toggleAddData.isWishlisted === true, 'Toggle added product to wishlist');

    const toggleRemoveRes = await fetch(`${BASE_URL}/wishlist/${testProductId}/toggle`, {
      method: 'PATCH',
      headers: authHeaders
    });
    const toggleRemoveData = await toggleRemoveRes.json();
    assert(toggleRemoveRes.status === 200 && toggleRemoveData.isWishlisted === false, 'Toggle removed product from wishlist');

    console.log(`\n========================================`);
    console.log(`ALL TESTS COMPLETED: ${passed} PASSED, ${failed} FAILED`);
    console.log(`========================================\n`);

  } catch (error) {
    console.error('Unexpected error during testing:', error);
  }
}

runTests();
