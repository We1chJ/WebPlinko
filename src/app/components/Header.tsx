'use client'
import React from 'react'
import Image from 'next/image'
import { usePlinkoStore } from '../store'
const Header = () => {
    const amount = usePlinkoStore((state) => state.balance);
    return (
        <div className="w-full h-full flex justify-center items-center shadow-lg shadow-b-lg" style={{ backgroundColor: 'rgb(26,44,56)', color: 'white', fontFamily: 'plinko_m' }}>
            <div className="flex absolute left-0 ml-4 text-3xl items-center" style={{ fontFamily: 'plinko_bold', fontWeight: 'bold' }}>
                <div className="mr-2">
                    <Image src={'/nogamble.png'} width={50} height={50} alt={'No gamble'} />
                </div>
                PLINKO
            </div>
            <div className='items-center relative'>
                <div
                    id="amount-display"
                    className='pr-8 bg-[#0F212E] text-white flex items-center justify-center rounded-l'
                    style={{ width: '140px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                    ${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <svg fill="none" viewBox="0 0 96 96" className="svg-icon absolute right-3 top-3" style={{ width: '16px', height: '16px' }}>
                    <title></title>
                    <path d="M48 96c26.51 0 48-21.49 48-48S74.51 0 48 0 0 21.49 0 48s21.49 48 48 48Z" fill="#FFC800"></path>
                    <path d="M48.16 21.92c10.16 0 16.56 4.92 20.32 10.72l-8.68 4.72c-2.28-3.44-6.48-6.16-11.64-6.16-8.88 0-15.36 6.84-15.36 16.12 0 9.28 6.48 16.12 15.36 16.12 4.48 0 8.44-1.84 10.6-3.76v-5.96H45.68v-8.96h23.4v18.76c-5 5.6-12 9.28-20.88 9.28-14.32 0-26.12-10-26.12-25.44C22.08 31.92 33.84 22 48.2 22l-.04-.08Z" fill="#473800"></path>
                </svg>
                <button
                    className="h-10 w-16 absolute top-0 -right-16 rounded-tr rounded-br transition duration-300 transform bg-blue-500 hover:bg-blue-700 text-white flex items-center justify-center text-sm"
                >
                    Wallet
                </button>
            </div>
        </div>
    )
}

export default Header