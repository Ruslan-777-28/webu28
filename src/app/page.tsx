export default function Home() {
  return (
    <main className="flex h-screen w-full overflow-hidden">
      {/* Left Block Container */}
      <div className="w-[60%] h-full flex flex-col">
        {/* This div creates the space at the top */}
        <div className="flex-grow" />
        {/* This is the gray block at the bottom */}
        <div className="bg-secondary p-8">
          <div className="h-96" />
        </div>
      </div>

      {/* Center Block */}
      <div className="flex-1 h-full bg-background p-8">
        {/* Content will go here */}
      </div>

      {/* Right Block */}
      <div className="w-[15%] h-full bg-black" />
    </main>
  );
}
