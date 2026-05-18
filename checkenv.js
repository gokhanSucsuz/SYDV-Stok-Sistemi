async function run() {
  const r = await fetch('http://localhost:3000/api/personnel');
  const d = await r.json();
  console.log(d);
}
run();
