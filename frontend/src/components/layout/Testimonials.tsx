export default function Testimonials() {
    const testimonials = [
        {
            text: "As someone who makes money online by writing, I wouldn't say I like fluff, so I will say that briefly. IeltsScoring is one of my favorite tools, and I use it daily. It will save you time and money.",
            name: "Tom cruise",
            role: "Content creator",
            img: "/images/people/avatar1.jpg",
        },
        {
            text: "Whenever I struggle to find the perfect phrasing, I use their paraphrasing tool, allowing me to generate unique sentences while maintaining the same context and meaning.",
            name: "Michanel Jackson",
            role: "Published author",
            img: "/images/people/avartar2.jpg",
        },
        {
            text: "I've been writing blogs and articles for over four years now, and as a teacher, I've always needed something to aid or simplify my writing process. That's when I discovered IeltsScoring and its capabilities.",
            name: "Taylor Switch",
            role: "English language trainer",
            img: "/images/people/avartar3.jpg",
        },
        {
            text: "As a student, I can confidently say that IeltsScoring has been a game-changer in my academic journey. It’s an indispensable tool for any student looking to improve their writing skills.",
            name: "Selena gomez",
            role: "Student",
            img: "/images/people/avatar4.jpg",
        },
    ];

    return (
        <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
                <h2 className="text-5xl font-bold text-gray-500 mb-12 font-[Suranna,serif]">
                    Why writers love us
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {testimonials.map((t, idx) => (
                        <div
                            key={idx}
                            className="bg-white border rounded-2xl p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between"
                        >
                            {/* Nội dung */}
                            <p className="text-gray-700 italic flex-1 mb-4">“{t.text}”</p>

                            {/* Avatar + tên */}
                            <div className="flex items-center gap-3 mt-6">
                                <img
                                    src={t.img}
                                    alt={t.name}
                                    className="h-10 w-10 rounded-full object-cover"
                                />
                                <div className="text-left">
                                    <p className="font-semibold text-gray-900">{t.name}</p>
                                    <p className="text-sm text-gray-500">{t.role}</p>
                                </div>
                            </div>
                        </div>

                    ))}
                </div>
            </div>
        </section>
    );
}