'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import React, { useState } from 'react'
import { usePlinkoStore } from '../store'

const Sidebar = () => {
    const [amount, setAmount] = useState(0);
    const [invalid, setInvalid] = useState(false);
    const setBetAmount = usePlinkoStore((state) => state.setBetAmount);

    return (
        <div className='w-full h-full p-3 flex flex-col items-center' style={{ fontFamily: 'plinko_m', backgroundColor: 'rgb(33,55,67)', color: 'white' }}>
            <Tabs defaultValue="manual" className='w-full p-2'>
                <TabsList className='w-full flex justify-center rounded-full text-white h-12' style={{ backgroundColor: '#0F212E', minWidth: '130px' }}>
                    <TabsTrigger value="manual" className='flex-1 flex justify-center rounded-full data-[state=active]:bg-[rgb(47,69,83)] data-[state=active]:text-white text-sm font-bold text-center h-10' style={{ fontFamily: 'plinko_m' }}>Manual</TabsTrigger>
                    <TabsTrigger value="auto" className='flex-1 flex justify-center rounded-full text-white data-[state=active]:bg-[rgb(47,69,83)] data-[state=active]:text-white text-sm font-bold text-center h-10' style={{ fontFamily: 'plinko_m' }}>Auto</TabsTrigger>
                </TabsList>
                <TabsContent value="manual">
                    <div className='w-full'>
                        <Label htmlFor="amount" style={{ color: 'rgb(177, 186, 211)', fontFamily: 'plinko_m', fontWeight: 'bold' }}>Amount</Label>
                        <div className='relative mr-20'>
                            {invalid && (
                                <div className="absolute -top-6 left-5 transform -translate-y-full w-60 p-2 bg-white text-black text-sm rounded shadow-lg">
                                    <div className="relative">
                                        <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-t-white"></div>
                                        Can't play more than your balance!
                                    </div>
                                </div>
                            )}
                            <Input
                                id="amount"
                                type='number'
                                step={0.01}
                                placeholder={'0.00'}
                                value={amount == 0 ? '0.00' : amount}
                                onChange={(e) => {
                                    const value = parseFloat(e.target.value);
                                    setAmount(isNaN(value) ? 0.00 : value);
                                    setInvalid(setBetAmount(value))
                                }}
                                onBlur={(e) => {
                                    const value = parseFloat(e.target.value);
                                    setAmount(isNaN(value) ? 0.00 : parseFloat(value.toFixed(2)));
                                    e.target.value = value.toFixed(2);
                                    setInvalid(setBetAmount(parseFloat(value.toFixed(2))))
                                }}
                                className={`pr-8 rounded-none ${invalid ? 'border-red-500 hover:border-red-500' : ''}`}
                            />
                            <svg fill="none" viewBox="0 0 96 96" className="svg-icon absolute right-3 top-3" style={{ width: '16px', height: '16px' }}>
                                <title></title>
                                <path d="M48 96c26.51 0 48-21.49 48-48S74.51 0 48 0 0 21.49 0 48s21.49 48 48 48Z" fill="#FFC800"></path>
                                <path d="M48.16 21.92c10.16 0 16.56 4.92 20.32 10.72l-8.68 4.72c-2.28-3.44-6.48-6.16-11.64-6.16-8.88 0-15.36 6.84-15.36 16.12 0 9.28 6.48 16.12 15.36 16.12 4.48 0 8.44-1.84 10.6-3.76v-5.96H45.68v-8.96h23.4v18.76c-5 5.6-12 9.28-20.88 9.28-14.32 0-26.12-10-26.12-25.44C22.08 31.92 33.84 22 48.2 22l-.04-.08Z" fill="#473800"></path>
                            </svg>
                            <button
                                className="h-10 w-10 absolute top-0 -right-10 rounded-none transition duration-300 transform bg-[rgb(47,69,83)] hover:bg-[rgb(80,110,130)] flex items-center justify-center"
                                onClick={() => setAmount((prevAmount) => parseFloat((prevAmount / 2).toFixed(2)))}
                            >
                                ½
                            </button>
                            <button
                                className="h-10 w-10 absolute top-0 -right-20 rounded-tr rounded-br transition duration-300 transform bg-[rgb(47,69,83)] hover:bg-[rgb(80,110,130)] text-sm flex items-center justify-center"
                                onClick={() => setAmount((prevAmount) => parseFloat((prevAmount * 2).toFixed(2)))}
                            >
                                2×
                            </button>
                            <div className="h-6 w-0.5 bg-[rgb(26,44,56)] absolute top-1/2 transform -translate-y-1/2 -right-10 rounded"></div>
                        </div>
                    </div>
                    <div className='w-full'>
                        <Label htmlFor="risk" style={{ color: 'rgb(177, 186, 211)', fontFamily: 'plinko_m' }}>Risk</Label>
                        <div className='relative'>
                            <select
                                id="risk"
                                className='w-full h-10 p-2 mt-1 rounded bg-[#0F212E] border-2 border-[rgb(47,69,83)] focus:border-[rgb(80,110,130)] hover:border-[rgb(80,110,130)] text-white transition duration-200 ease-in-out appearance-none outline-none'
                                style={{ fontFamily: 'plinko_m' }}
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                            <div className="absolute right-0 flex items-center pr-3 pointer-events-none" style={{ top: '55%', transform: 'translateY(-50%)' }}>
                                <svg fill="rgb(177, 186, 211)" viewBox="0 0 64 64" className="svg-icon" style={{ width: '15px', height: '15px' }}>
                                    <title></title>
                                    <path d="M32.271 49.763 9.201 26.692l6.928-6.93 16.145 16.145 16.144-16.144 6.93 6.929-23.072 23.07h-.005Z"></path>
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div className='w-full'>
                        <Label htmlFor="rows" style={{ color: 'rgb(177, 186, 211)', fontFamily: 'plinko_m' }}>Rows</Label>
                        <div className='relative'>
                            <select
                                id="rows"
                                className='w-full h-10 p-2 mt-1 rounded bg-[#0F212E] border-2 border-[rgb(47,69,83)] focus:border-[rgb(80,110,130)] hover:border-[rgb(80,110,130)] text-white transition duration-200 ease-in-out appearance-none outline-none'
                                style={{ fontFamily: 'plinko_m' }}
                            >
                                {Array.from({ length: 9 }, (_, i) => i + 8).map((value) => (
                                    <option key={value} value={value}>{value}</option>
                                ))}
                            </select>
                            <div className="absolute right-0 flex items-center pr-3 pointer-events-none" style={{ top: '55%', transform: 'translateY(-50%)' }}>
                                <svg fill="rgb(177, 186, 211)" viewBox="0 0 64 64" className="svg-icon" style={{ width: '15px', height: '15px' }}>
                                    <title></title>
                                    <path d="M32.271 49.763 9.201 26.692l6.928-6.93 16.145 16.145 16.144-16.144 6.93 6.929-23.072 23.07h-.005Z"></path>
                                </svg>
                            </div>
                        </div>
                        <button
                            id="bet-btn"
                            className="w-full h-14 text-black font-bold py-2 rounded transition duration-300 ease-in-out transform hover:bg-green-500 mt-4 text-lg"
                            style={{ backgroundColor: '#00ff00' }}
                            disabled={invalid}
                        >
                            Bet
                        </button>
                    </div>
                </TabsContent>
                <TabsContent value="auto">
                    Change your password here.
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default Sidebar