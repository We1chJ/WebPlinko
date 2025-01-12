'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import React from 'react'

const Sidebar = () => {
    return (
        <div className='w-full h-full p-4 flex flex-col items-center' style={{ fontFamily: 'plinko_m', backgroundColor: 'rgb(33,55,67)', color: 'white' }}>
            <Tabs defaultValue="manual" className='w-full p-2'>
                <TabsList className='w-full flex justify-center rounded-full text-white h-12' style={{ backgroundColor: '#0F212E', minWidth: '130px' }}>
                    <TabsTrigger value="manual" className='flex-1 flex justify-center rounded-full data-[state=active]:bg-[rgb(47,69,83)] data-[state=active]:text-white text-sm font-bold text-center h-10' style={{ fontFamily: 'plinko_m' }}>Manual</TabsTrigger>
                    <TabsTrigger value="auto" className='flex-1 flex justify-center rounded-full text-white data-[state=active]:bg-[rgb(47,69,83)] data-[state=active]:text-white text-sm font-bold text-center h-10' style={{ fontFamily: 'plinko_m' }}>Auto</TabsTrigger>
                </TabsList>
                <TabsContent value="manual">
                    <div className='w-full '>
                        <Label htmlFor="amount" style={{ color: 'rgb(177, 186, 211)', fontFamily: 'plinko_m', fontWeight: 'bold' }}>Amount</Label>
                        <div className='relative'>
                            <Input
                                id="amount"
                                type='number'
                                step={0.01}
                                placeholder={'0.00'}
                                className='pr-8'
                            />
                            <svg fill="none" viewBox="0 0 96 96" className="svg-icon absolute right-3 top-3" style={{ width: '16px', height: '16px' }}>
                                <title></title>
                                <path d="M48 96c26.51 0 48-21.49 48-48S74.51 0 48 0 0 21.49 0 48s21.49 48 48 48Z" fill="#FFC800"></path>
                                <path d="M48.16 21.92c10.16 0 16.56 4.92 20.32 10.72l-8.68 4.72c-2.28-3.44-6.48-6.16-11.64-6.16-8.88 0-15.36 6.84-15.36 16.12 0 9.28 6.48 16.12 15.36 16.12 4.48 0 8.44-1.84 10.6-3.76v-5.96H45.68v-8.96h23.4v18.76c-5 5.6-12 9.28-20.88 9.28-14.32 0-26.12-10-26.12-25.44C22.08 31.92 33.84 22 48.2 22l-.04-.08Z" fill="#473800"></path>
                            </svg>
                        </div>
                    </div>
                    <div className='w-full'>
                        <Label htmlFor="risk" style={{ color: 'rgb(177, 186, 211)', fontFamily: 'plinko_m' }}>Risk</Label>
                        <Input
                            id="risk"
                        />
                    </div>
                    <div className='w-full'>
                        <Label htmlFor="rows" style={{ color: 'rgb(177, 186, 211)', fontFamily: 'plinko_m' }}>Rows</Label>
                        <Input
                            id="rows"
                        />
                    </div>
                </TabsContent>
                <TabsContent value="auto">
                    Change your password here.
                </TabsContent>
            </Tabs>
            <Button
                id="bet-btn"
                className="w-full h-14 text-black font-bold py-2 px-4 rounded transition duration-300 ease-in-out transform hover:bg-green-700 hover:scale-105 mt-4 text-lg"
                style={{ backgroundColor: '#00ff00' }}
            >
                Bet
            </Button>
        </div>
    )
}

export default Sidebar