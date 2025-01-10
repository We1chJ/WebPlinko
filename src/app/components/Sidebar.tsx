'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import React from 'react'

const Sidebar = () => {
    return (
        <div className='w-full h-full p-4 flex flex-col items-center' style={{ backgroundColor: 'rgb(33,55,67)', color: 'white' }}>
            <Tabs defaultValue="manual" className='w-full p-2'>
                <TabsList className='w-full flex justify-center rounded-full text-white h-12' style={{ backgroundColor: '#0F212E' }}>
                    <TabsTrigger value="manual" className='w-full flex justify-center rounded-full data-[state=active]:bg-[rgb(47,69,83)] data-[state=active]:text-white text-sm font-bold text-center h-10' style={{ fontFamily: 'plinko_m' }}>Manual</TabsTrigger>
                    <TabsTrigger value="auto" className='w-full flex justify-center rounded-full text-white data-[state=active]:bg-[rgb(47,69,83)] data-[state=active]:text-white text-sm font-bold text-center h-10' style={{ fontFamily: 'plinko_m' }}>Auto</TabsTrigger>
                </TabsList>
                <TabsContent value="manual">
                    <div className='w-full'>
                        <Label htmlFor="amount" style={{ color: 'rgb(177, 186, 211)', fontFamily: 'plinko_m' }}>Amount</Label>
                        <Input
                            id="amount"
                        />
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
                className="w-full h-16 text-black font-bold py-2 px-4 rounded transition duration-300 ease-in-out transform hover:bg-green-700 hover:scale-105 mt-4"
                style={{ backgroundColor: '#00ff00' }}
            >
                Bet
            </Button>
        </div>
    )
}

export default Sidebar