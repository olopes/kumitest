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
package kumitest;

import static org.junit.platform.engine.discovery.DiscoverySelectors.selectClass;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.junit.platform.launcher.Launcher;
import org.junit.platform.launcher.LauncherDiscoveryRequest;
import org.junit.platform.launcher.core.LauncherDiscoveryRequestBuilder;
import org.junit.platform.launcher.core.LauncherFactory;
import org.junit.platform.launcher.listeners.SummaryGeneratingListener;
import org.junit.platform.launcher.listeners.TestExecutionSummary;
import org.junit.platform.launcher.listeners.TestExecutionSummary.Failure;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class KumitestController {

	public KumitestController() {
		// TODO inject test runner
	}

	TestExecutionSummary runTest(String className) {
		LauncherDiscoveryRequest request = LauncherDiscoveryRequestBuilder.request()
				.selectors(
						selectClass(className)
						)
				.build();

		Launcher launcher = LauncherFactory.create();

		// Register a listener of your choice
		SummaryGeneratingListener listener = new SummaryGeneratingListener();
		launcher.registerTestExecutionListeners(listener);

		launcher.execute(request);

		return listener.getSummary();
	}
	
	List<Map<String,Object>> presentFailures(List<Failure> junitFailures) {
		
		if(null == junitFailures || junitFailures.isEmpty()) return Collections.emptyList();
		List<Map<String,Object>> failures = new ArrayList<>(junitFailures.size());
		
		for(Failure fail : junitFailures) {
			Map<String,Object> failure = new HashMap<>();
			failure.put("test", fail.getTestIdentifier().getDisplayName());
			failure.put("message", fail.getException().getMessage());
			failures.add(failure);
		}

		return failures;
	}

	@GetMapping("/runtest1")
	public String runtest(Model model) {
		TestExecutionSummary summary = runTest("production.service.ProductionServiceImplTest");
		long successCount = summary.getTestsSucceededCount();
		long failureCount = summary.getTestsFailedCount();
		List<Map<String,Object>> failures = presentFailures(summary.getFailures());

		model.addAttribute("test", "test1");
		model.addAttribute("successCount", successCount);
		model.addAttribute("failureCount", failureCount);
		model.addAttribute("failures", failures);

		return "testresult";
	}

}