const { execSync } = require('child_process');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'prisma', 'dev.db');

const categories = [
  { name: '宏观洞察', slug: 'macro-insights' },
  { name: '市场分析', slug: 'market-analysis' },
  { name: '人生感悟', slug: 'life-reflections' }
];

function createCuid() {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 10);
  const counter = Math.floor(Math.random() * 1000).toString(36);
  return 'c' + timestamp + random + counter;
}

function addCategories() {
  const now = new Date().toISOString();
  console.log('开始添加文章分类...
');
  categories.forEach(cat => {
    const id = createCuid();
    const sql = "INSERT OR IGNORE INTO Category (id, name, slug, createdAt, updatedAt) VALUES ('" + id + "', '" + cat.name + "', '" + cat.slug + "', '" + now + "', '" + now + "');";
    try {
      execSync("sqlite3 "" + DB_PATH + "" "" + sql + "");
      console.log('✓ 处理分类: ' + cat.name + ' (' + cat.slug + ')');
    } catch (error) {
      console.error('✗ 添加失败: ' + cat.name, error.message);
    }
  });
  console.log('
分类添加完成！');
  console.log('
当前数据库中的分类：');
  try {
    const result = execSync("sqlite3 "" + DB_PATH + "" "SELECT name, slug FROM Category;"", { encoding: 'utf-8' });
    console.log(result);
  } catch (e) {}
}

addCategories();