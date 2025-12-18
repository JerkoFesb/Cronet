import Link from "next/link";


export default async function DetaljiPosta({ 
  params 
}: { 
  params: Promise<{ id: string }> // Kažemo TS-u da params stiže kao obećanje (Promise)
}) {
  // OVO JE KLJUČNA PROMJENA: Moramo "otpakirati" params
  const { id } = await params;

  // Sada koristimo taj otpakirani 'id'
  const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`);
  const post = await response.json();

  return (
    <div className="p-10 max-w-2xl mx-auto">
      <Link href="/pretraga" className="text-blue-500 hover:underline">← Natrag na pretragu</Link>
      
      <h1 className="text-4xl font-bold mt-6 capitalize">{post.title}</h1>
      <div className="h-1 w-20 bg-[#4CAF82] my-4"></div>
      
      <p className="text-lg text-gray-700 leading-relaxed">{post.body}</p>
      
      <div className="mt-8 p-4 bg-gray-50 rounded-lg italic text-gray-500">
        Korisnik ID: {post.userId} | Post ID: {post.id}
      </div>
    </div>
  );
}