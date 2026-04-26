'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import { usePlinkoStore } from '../store'
const Header = () => {
    const balance = usePlinkoStore((state) => state.balance);
    const changeBalance = usePlinkoStore(state => state.changeBalance);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [showNoGamblingModal, setShowNoGamblingModal] = useState(false);
    const [cardDetails, setCardDetails] = useState({
        name: '',
        number: '',
        expiry: '',
        cvc: ''
    });
    const [selectedAmount, setSelectedAmount] = useState(null);

    const paymentAmounts = [10, 25, 50, 100, 250, 500];

    const handlePayClick = () => {
        if (selectedAmount && cardDetails.name && cardDetails.number && cardDetails.expiry && cardDetails.cvc) {
            changeBalance(selectedAmount);
            setShowPaymentModal(false);
            setShowNoGamblingModal(true);
            setTimeout(() => setShowNoGamblingModal(false), 4000);
            setCardDetails({ name: '', number: '', expiry: '', cvc: '' });
            setSelectedAmount(null);
        }
    };
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
                    id="balance"
                    className='pr-8 bg-[#0F212E] text-white flex items-center justify-center rounded-l'
                    style={{ width: '140px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                    ${balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <svg fill="none" viewBox="0 0 96 96" className="svg-icon absolute right-3 top-3" style={{ width: '16px', height: '16px' }}>
                    <title></title>
                    <path d="M48 96c26.51 0 48-21.49 48-48S74.51 0 48 0 0 21.49 0 48s21.49 48 48 48Z" fill="#FFC800"></path>
                    <path d="M48.16 21.92c10.16 0 16.56 4.92 20.32 10.72l-8.68 4.72c-2.28-3.44-6.48-6.16-11.64-6.16-8.88 0-15.36 6.84-15.36 16.12 0 9.28 6.48 16.12 15.36 16.12 4.48 0 8.44-1.84 10.6-3.76v-5.96H45.68v-8.96h23.4v18.76c-5 5.6-12 9.28-20.88 9.28-14.32 0-26.12-10-26.12-25.44C22.08 31.92 33.84 22 48.2 22l-.04-.08Z" fill="#473800"></path>
                </svg>
                <button
                    className="h-10 w-16 absolute top-0 -right-16 rounded-tr rounded-br transition duration-300 transform bg-blue-500 hover:bg-blue-700 text-white flex items-center justify-center text-sm"
                    onClick={() => setShowPaymentModal(true)}
                >
                    Wallet
                </button>
            </div>

            {showPaymentModal && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
                    <div className="bg-gradient-to-b from-[rgb(20,35,45)] to-[rgb(33,55,67)] rounded-lg shadow-2xl w-full max-w-sm border-2 border-[rgb(80,110,130)]" style={{ fontFamily: 'plinko_m' }}>
                        {/* Header with security badge */}
                        <div className="bg-gradient-to-r from-[rgb(15,25,35)] to-[rgb(30,50,65)] px-4 py-3 border-b-2 border-[rgb(80,110,130)] flex justify-between items-center">
                            <div>
                                <h2 className="text-white text-lg font-bold">Secure Payment</h2>
                            </div>
                            <div className="text-2xl">💳</div>
                        </div>

                        <div className="p-4">
                            {/* Amount Selection */}
                            <div className="mb-3">
                                <div className="flex justify-between items-center mb-2">
                                    <label className="text-white text-xs font-bold">Deposit Amount</label>
                                    {selectedAmount && <span className="text-green-400 font-bold text-sm">${selectedAmount}</span>}
                                </div>
                                <div className="grid grid-cols-3 gap-1 mb-2">
                                    {paymentAmounts.map((amount) => (
                                        <button
                                            key={amount}
                                            onClick={() => setSelectedAmount(amount)}
                                            className={`py-2 rounded font-bold transition duration-200 text-xs ${
                                                selectedAmount === amount
                                                    ? 'bg-gradient-to-r from-green-500 to-green-600 text-black shadow-lg'
                                                    : 'bg-[rgb(47,69,83)] text-white hover:bg-[rgb(80,110,130)]'
                                            }`}
                                        >
                                            ${amount}
                                        </button>
                                    ))}
                                </div>
                                <div className="flex gap-1">
                                    <span className="text-white text-xs font-bold pt-2">Custom:</span>
                                    <input
                                        type="number"
                                        placeholder="Enter amount"
                                        min="1"
                                        step="0.01"
                                        value={selectedAmount && !paymentAmounts.includes(selectedAmount) ? selectedAmount : ''}
                                        onChange={(e) => {
                                            const value = parseFloat(e.target.value);
                                            if (!isNaN(value) && value > 0) {
                                                setSelectedAmount(value);
                                            } else if (e.target.value === '') {
                                                setSelectedAmount(null);
                                            }
                                        }}
                                        className="flex-1 p-2 rounded bg-[rgb(15,33,46)] text-white border-2 border-[rgb(47,69,83)] focus:border-green-500 outline-none transition text-xs"
                                    />
                                </div>
                            </div>

                            {/* Card Preview */}
                            <div className="mb-3 p-3 bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg text-white font-mono text-xs relative overflow-hidden">
                                <div className="absolute top-0 right-0 text-xl opacity-20">💳</div>
                                <div className="text-blue-200 mb-2">CARD</div>
                                <div className="tracking-widest font-bold mb-2 text-xs">{cardDetails.number || '•••• •••• •••• ••••'}</div>
                                <div className="flex justify-between items-end">
                                    <div>
                                        <div className="text-blue-200 text-xs">NAME</div>
                                        <div className="text-xs font-bold">{cardDetails.name || 'NAME'}</div>
                                    </div>
                                    <div>
                                        <div className="text-blue-200 text-xs">EXP</div>
                                        <div className="text-xs font-bold">{cardDetails.expiry || 'MM/YY'}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Cardholder Name */}
                            <div className="mb-2">
                                <label className="text-white text-xs font-bold block mb-1">👤 Name</label>
                                <input
                                    type="text"
                                    placeholder="John Doe"
                                    value={cardDetails.name}
                                    onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
                                    className="w-full p-2 rounded bg-[rgb(15,33,46)] text-white border-2 border-[rgb(47,69,83)] focus:border-green-500 outline-none transition text-xs"
                                />
                            </div>

                            {/* Card Number */}
                            <div className="mb-2">
                                <label className="text-white text-xs font-bold block mb-1">💳 Card</label>
                                <input
                                    type="text"
                                    placeholder="4532 1234 5678 9010"
                                    value={cardDetails.number}
                                    onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                                    maxLength="19"
                                    className="w-full p-2 rounded bg-[rgb(15,33,46)] text-white border-2 border-[rgb(47,69,83)] focus:border-green-500 outline-none transition text-xs"
                                />
                            </div>

                            {/* Expiry and CVC */}
                            <div className="flex gap-2 mb-3">
                                <div className="flex-1">
                                    <label className="text-white text-xs font-bold block mb-1">📅 Exp</label>
                                    <input
                                        type="text"
                                        placeholder="MM/YY"
                                        value={cardDetails.expiry}
                                        onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                                        maxLength="5"
                                        className="w-full p-2 rounded bg-[rgb(15,33,46)] text-white border-2 border-[rgb(47,69,83)] focus:border-green-500 outline-none transition text-xs"
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="text-white text-xs font-bold block mb-1">🔐 CVC</label>
                                    <input
                                        type="text"
                                        placeholder="123"
                                        value={cardDetails.cvc}
                                        onChange={(e) => setCardDetails({ ...cardDetails, cvc: e.target.value })}
                                        maxLength="4"
                                        className="w-full p-2 rounded bg-[rgb(15,33,46)] text-white border-2 border-[rgb(47,69,83)] focus:border-green-500 outline-none transition text-xs"
                                    />
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-2">
                                <button
                                    onClick={() => {
                                        setShowPaymentModal(false);
                                        setCardDetails({ name: '', number: '', expiry: '', cvc: '' });
                                        setSelectedAmount(null);
                                    }}
                                    className="flex-1 py-2 rounded bg-[rgb(47,69,83)] hover:bg-[rgb(80,110,130)] text-white font-bold transition duration-200 text-xs"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handlePayClick}
                                    disabled={!selectedAmount || !cardDetails.name || !cardDetails.number || !cardDetails.expiry || !cardDetails.cvc}
                                    className="flex-1 py-2 rounded bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-black font-bold transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-xs shadow-lg"
                                >
                                    💰 Pay ${selectedAmount || '0'}
                                </button>
                            </div>
                        </div>

                        {/* Footer with card logos */}
                        <div className="bg-[rgb(15,25,35)] px-4 py-2 border-t-2 border-[rgb(80,110,130)] flex justify-center gap-2 text-xs">
                            <span className="text-white">💳 Visa</span>
                            <span className="text-gray-400">•</span>
                            <span className="text-white">💳 MC</span>
                            <span className="text-gray-400">•</span>
                            <span className="text-white">💳 Amex</span>
                        </div>
                    </div>
                </div>
            )}

            {showNoGamblingModal && (
                <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 animate-pulse">
                    <div className="bg-gradient-to-b from-red-700 to-red-900 rounded-lg p-8 w-96 shadow-2xl text-center border-4 border-red-500 transform scale-105" style={{ fontFamily: 'plinko_m' }}>
                        <div className="text-6xl mb-4 animate-bounce">🚫</div>
                        <h2 className="text-white text-4xl font-bold mb-4 uppercase tracking-wider">NO GAMBLING</h2>
                        <div className="bg-red-800 p-4 rounded mb-4 border-2 border-red-400">
                            <p className="text-white text-lg font-bold">⚠️ DISCLAIMER</p>
                            <p className="text-white text-sm mt-2">This is a demo project for educational purposes only.</p>
                            <p className="text-white text-sm mt-2">Real gambling is prohibited and illegal in most jurisdictions.</p>
                        </div>
                        <p className="text-yellow-200 text-xs">If you or someone you know has a gambling problem, please seek help.</p>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Header