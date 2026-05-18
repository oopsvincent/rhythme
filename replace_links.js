const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      if (f !== 'node_modules' && f !== '.next' && f !== '.git') {
        walkDir(dirPath, callback);
      }
    } else {
      if (dirPath.endsWith('.ts') || dirPath.endsWith('.tsx') || dirPath.endsWith('.js') || dirPath.endsWith('.jsx')) {
        callback(dirPath);
      }
    }
  });
}

function replaceDashboardLinks(dir) {
  walkDir(dir, (filePath) => {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // We only want to replace "/dashboard/SOMETHING" where SOMETHING is not empty
    // Examples: "/dashboard/tasks", '/dashboard/focus', `/dashboard/journal/${id}`
    // But we don't want to replace "/dashboard" -> "/"
    
    // Using regex: find /dashboard/ followed by word chars or variables.
    // Actually, just replacing "/dashboard/" with "/" in strings.
    // Because if it's "/dashboard", it doesn't have a trailing slash.
    // If it's "/dashboard/", it becomes "/".
    // Let's replace `"/dashboard/` with `"/`
    content = content.replace(/(["'`])\/dashboard\//g, '$1/');
    
    // But wait, what if someone wrote `href="/dashboard"` without a trailing slash?
    // Let's check for exact "/dashboard" that are being redirected to "/" ? No, "/dashboard" goes to dashboard.
    // Only subpages are flattened!
    
    // Also, we might have `pathname?.startsWith("/dashboard/habits")` -> `pathname?.startsWith("/habits")`
    // And `pathname === '/dashboard/focus'` -> `pathname === '/focus'`

    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('Updated:', filePath);
    }
  });
}

const targetDirs = [
  path.join(__dirname, 'app'),
  path.join(__dirname, 'components'),
  path.join(__dirname, 'lib')
];

targetDirs.forEach(dir => {
  if (fs.existsSync(dir)) {
    replaceDashboardLinks(dir);
  }
});
