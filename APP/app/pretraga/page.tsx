import Link from "next/link";

export default async function PretragaPage() {
  const response = await fetch("https://jsonplaceholder.typicode.com/posts");
  const podatci = await response.json();
  const blogovi = podatci.slice(0, 6);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Rezultati pretrage</h1>
      <div className="grid gap-4">
        {blogovi.map((post: any) => (
          <div key={post.id} className="p-4 border rounded-lg shadow-sm hover:border-[#4CAF82] transition">
            <h2 className="text-xl font-semibold capitalize">{post.title}</h2>
            <Link 
              href={`/pretraga/${post.id}`} 
              className="text-[#4CAF82] font-bold mt-2 inline-block"
            >
              Pročitaj više →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}