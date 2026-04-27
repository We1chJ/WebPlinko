import React from 'react'

const Footer = () => {
    return (
        <div className="w-full h-full flex justify-center items-center gap-4 shadow-lg shadow-b-lg" style={{ backgroundColor: 'rgb(26,44,56)', color: 'white', fontFamily: 'plinko_m' }}>
            <span>Plinko No Gamble</span>
            <span className="text-gray-400">•</span>
            <a
                href="https://github.com/We1chJ/WebPlinko"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 transition duration-200 font-bold flex items-center gap-1"
            >
                ⭐ Star on GitHub
            </a>
            <span className="text-gray-400">•</span>
            <a
                href="https://github.com/We1chJ"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 transition duration-200"
            >
                @We1chJ
            </a>
        </div>
    )
}

export default Footer