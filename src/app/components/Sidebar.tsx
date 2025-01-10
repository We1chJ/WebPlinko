'use client'

import { Button } from '@/components/ui/button'
import React from 'react'

const Sidebar = () => {
    return (
        <div className='w-full h-full p-4 flex justify-center' style={{ backgroundColor: 'rgb(33,55,67)', color: 'white' }}>
            <Button
                id="bet-btn"
                className="w-1/2 text-black font-bold py-2 px-4 rounded transition duration-300 ease-in-out transform hover:bg-green-700 hover:scale-105"
                style={{ backgroundColor: '#00ff00' }}
            >
                Bet
            </Button>
        </div>
    )
}

export default Sidebar