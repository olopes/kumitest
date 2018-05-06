/*
 * MIT License
 * 
 * Copyright (c) 2018 olopes
 * 
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 * 
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 * 
 */
package production.service;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;

import production.repository.ProductionRepository;
import production.service.ProductionServiceImpl;

class ProductionServiceImplTest {

	ProductionRepository repository;
	ProductionServiceImpl service;
	
	@BeforeEach
	void setUp() throws Exception {
		repository = mock(ProductionRepository.class);
		
		service = new ProductionServiceImpl(repository);
	}

	@Test
	void getAccountBalance_should_retrieve_both_account_balances_and_add_them_when_both_accounts_exist() {
		doReturn(20).when(repository).getAccountBalance(anyString());
		int expected = 40;

		int actual = service.sumBalances("acc1", "acc2");
		
		assertThat(actual).as("Actual balance sum should be 40").isEqualTo(expected);
	}

	@Disabled
	@Test
	void getAccountBalance_should_fail() {
		fail("This test always fail");
	}

}