import React from 'react'

const Login = () => {
    return (
        <div className='mx-auto p-4 sm:p-6 lg:p-10'>
            <div className="mx-auto mb-6 text-center">
                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Coin Tracker System</h1>
                <p className="mt-1 text-sm text-gray-600 font-semibold">Save your money</p>
            </div>

            <form action="" className='grid gap-4 rounded-2xl border  bg-purple-100 p-4 shadow-sm sm:p-6'>

                <div className='space-y-2'>
                    <label htmlFor="email" className="block text-sm font-medium">Email</label>
                    <div className="mt-1">
                        <input
                            type="email"
                            name="email"
                            id="email"
                            className="block w-full rounded-md shadow-sm focus:ring-2 
                            focus:ring-purple-500 focus:ring-offset-2 sm:text-sm 
                            outline-none px-2 py-1"
                            placeholder="example@gmail.com"
                        />
                    </div>
                </div>

                <div className='space-y-2'>
                    <label htmlFor="password" className="block text-sm font-medium">Password</label>
                    <div className="mt-1">
                        <input
                            type="password"
                            name="password"
                            id="password"
                            className="block w-full rounded-md shadow-sm focus:ring-2 
                            focus:ring-purple-500 focus:ring-offset-2 sm:text-sm 
                            outline-none px-2 py-1"
                            placeholder="**********"
                        />
                    </div>
                </div>

            </form>
        </div>
    )
}

export default Login