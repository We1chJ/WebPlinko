'use client'

import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import React from 'react'

const Sidebar = () => {
    return (
        <div className='w-full h-full p-4 flex flex-col justify-center' style={{ backgroundColor: 'rgb(33,55,67)', color: 'white' }}>
            <Tabs defaultValue="manual" className='w-full p-2'>
                <TabsList>
                    <TabsTrigger value="manual">Manual</TabsTrigger>
                    <TabsTrigger value="auto">Auto</TabsTrigger>
                </TabsList>
                <TabsContent value="manual">
                    Make changes to your account here.
                </TabsContent>
                <TabsContent value="auto">
                    Change your password here.
                </TabsContent>
            </Tabs>
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