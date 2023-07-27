


import React from 'react'
import { render, fireEvent, waitFor, screen, act, waitForElement } from "@testing-library/react"
import App from '../App'


const movies = [
    {
        id: 1,
        title: "this is the first title",
        description: "and this the description"
    },
    {
        id: 2,
        title: "this is the second title",
        description: "and this the description"
    }
]

global.fetch = require('jest-fetch-mock')

describe("App component", () => {
    
    test("should display and hide loading", async () => {
        fetch.mockResponseOnce(JSON.stringify(movies))
        act(() => {
            render(<App />)
        })
        expect(screen.getByTestId('loading')).toBeTruthy()
    })

})
