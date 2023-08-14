export function runAxeCore(result: any) {
  const issues: any[] = []

  for (const item of result.violations) {
    processViolation(item, issues)
  }

  for (const item of result.incomplete) {
    processIncomplete(item, issues)
  }

  return issues
}

function processViolation(issue: any, issues: any) {
  return processIssue(issue, issues, 'error')
}

function processIncomplete(issue: any, issues: any) {
  return processIssue(issue, issues, 'warning')
}

function processIssue(axeIssue: any, issues: any, impact: any) {
  if (axeIssue.nodes && axeIssue.nodes.length) {
    for (const node of axeIssue.nodes) {
      issues.push({
        type: impact,
        code: axeIssue.id,
        message: axeIssue.help,
        element: window.document.querySelector(selectorToString(node.target)),
        runnerExtras: {
          description: axeIssue.description,
          impact: axeIssue.impact,
          helpUrl: axeIssue.helpUrl,
        },
        runner: 'axe',
      })
    }
  }
}

function selectorToString(selectors: any) {
  return selectors
    .reduce(
      (selectorParts: any, selector: any) => selectorParts.concat(selector),
      []
    )
    .join(' ')
}
