import React from 'react'
import { render, fireEvent, waitFor, screen, act, waitForElement, waitForElementToBeRemoved } from "@testing-library/react"
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
        // call API
        fetch.mockResponseOnce(JSON.stringify(movies))
        // Expect state update
        act(() => {
            render(<App/>)
        })
        expect(screen.getByTestId('loading')).toBeTruthy()
        await waitForElement(() => screen.getByTestId('list')) 
        // With query if it's missing is not throwing an error
        expect(screen.queryByTestId('loading')).toBeFalsy()
      
    })

    test("should display an error on bad request", async () => {
        fetch.mockResponseOnce(null, { stauts: 500 })
        act(() => {
            render(<App/>)
        })
        // Expect an error
        expect.assertions(1)
        await waitForElementToBeRemoved(() => screen.getByTestId('loading'))
        expect(screen.queryByText(/error/i)).toBeInTheDocument()
    })

    test("should display list of movies after API request", async () => {
        fetch.mockResponseOnce(JSON.stringify(movies))
        act(() => {
            render(<App/>)
        })
        await waitForElementToBeRemoved(() => screen.getByTestId('loading'))
        const list = screen.getByTestId('list')
        expect(list).toBeTruthy()
        expect(list.children.length).toBe(movies.length)
    })

    test("new movie btn should be present and trigger form", async () => {
        fetch.mockResponseOnce(JSON.stringify(movies))
        act(() => {
            render(<App/>)
        })
        await waitForElementToBeRemoved(() => screen.getByTestId('loading'))
        
        const btn = screen.getByRole('button', { name: "New movie" })
        fireEvent.click(btn)

        await waitFor (() => {
            expect(screen.getByTestId('movie-form')).tobeTruthy()
        })
        
    })

    test("should display movie details when clicked on heading", async () => {
        fetch.mockResponseOnce(JSON.stringify(movies))
        act(() => {
            render(<App/>)
        })
        await waitForElementToBeRemoved(() => screen.getByTestId('loading'))
        
        const headings = screen.getAllByTestId('heading')
        fireEvent.click(headings[1])
        await waitFor(() => {
            expect(screen.queryByText(movies[0].description)).toBeFalsy()
            expect(screen.getByText(movies[1].description)).toBeTruthy()
        })   
    })
})
 