import React from 'react';

// --- SVG Icon Components ---
const TruckIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.125-.504 1.125-1.125V14.25m-17.25 4.5v-9m17.25 9v-9m-9-4.5h.008v.008H12v-.008zM12 1.5l.382.69.018.033a8.25 8.25 0 014.242 9.033L12 21l-4.642-9.744a8.25 8.25 0 014.242-9.033l.018-.033L12 1.5z" />
    </svg>
);

const ShieldCheckIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.286zm0 13.036h.008v.008H12v-.008z" />
    </svg>
);

const UserGroupIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m-7.5-2.962a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5zM10.5 1.5a9 9 0 105.25 16.5h-1.5a1.5 1.5 0 01-1.5-1.5v-1.5a3.75 3.75 0 00-7.5 0v1.5a1.5 1.5 0 01-1.5 1.5H3.375A9 9 0 0010.5 1.5z" />
    </svg>
);

const GlobeAltIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A11.953 11.953 0 0112 16.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 013 12c0-.778.099-1.533.284-2.253m0 0c.878-.236 1.81-.363 2.79-.363m11.376 0c.98.001 1.912.127 2.79.363" />
    </svg>
);

const SparklesIcon = ({ className }) => (
     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.562L16.25 21.75l-.648-1.188a2.25 2.25 0 01-1.423-1.423L13.125 18l1.188-.648a2.25 2.25 0 011.423-1.423L16.25 15l.648 1.188a2.25 2.25 0 011.423 1.423L19.375 18l-1.188.648a2.25 2.25 0 01-1.423 1.423z" />
    </svg>
);

const Achievements = () => {
    const stats = [
        { id: 1, name: 'Tons of Produce Delivered', value: '10,000+', icon: TruckIcon },
        { id: 2, name: 'Farmers on our Platform', value: '2,500+', icon: UserGroupIcon },
        { id: 3, name: 'Happy Customers Served', value: '50,000+', icon: SparklesIcon },
        { id: 4, name: 'Regions Covered', value: '20+', icon: GlobeAltIcon },
        { id: 5, name: 'Trusted Partnerships', value: '99%', icon: ShieldCheckIcon },
    ];

    return (
        <section className="bg-green-50 py-16 sm:py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-green-800 sm:text-4xl">
                        Trusted by Thousands, Proven by Results
                    </h2>
                    <p className="mt-4 text-lg text-gray-600">
                        We're proud of the community we've built and the connections we've fostered between dedicated farmers and conscious buyers.
                    </p>
                </div>
                <div className="mt-12">
                    <div className="grid grid-cols-2 gap-y-10 gap-x-6 sm:grid-cols-3 lg:grid-cols-5">
                        {stats.map((stat) => (
                            <div key={stat.id} className="text-center">
                                <stat.icon className="mx-auto h-12 w-12 text-green-600" aria-hidden="true" />
                                <p className="mt-4 text-2xl font-bold tracking-tight text-gray-900">{stat.value}</p>
                                <p className="mt-1 text-base text-gray-600">{stat.name}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Achievements;
