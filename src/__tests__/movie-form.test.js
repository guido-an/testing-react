


import React from 'react'
import { render, fireEvent, screen, waitFor } from "@testing-library/react"
import MovieForm from '../components/movie-form'

global.fetch = require('jest-fetch-mock')

const empty_movie = {
    title: "",
    description: ""
}

const movie = {
    id: 1,
    title: "this is the title",
    description: "and this the description"
}
 
describe("Movie form components", () => {
    
    test("should have form elements", () => {
        render(<MovieForm movie={empty_movie}/> )
        expect(screen.getByLabelText(/title/i)).toBeTruthy()
        expect(screen.getByLabelText(/description/i)).toBeTruthy()
        expect(screen.getByRole("button", { name: /create/i})).toBeTruthy()
    })

    test("should display form elements with movie data", () => {
        const { getByLabelText } = render(<MovieForm movie={movie}/> )
        expect(getByLabelText(/title/i).value).toBe(movie.title)
        expect(getByLabelText(/description/i).value).toBe(movie.description)
        expect(screen.getByRole("button", { name: /update/i})).toBeTruthy()
    })

    test("should trigger API request when clicked on button", async () => {
        const updatedMovie = jest.fn()
        jest.spyOn(global, "fetch").mockImplementationOnce(() => {
            Promise.resolve({
                json: () => Promise.resolve(movie)
            })
        })

        const { getByRole } = render(<MovieForm movie={movie} updatedMovie={updatedMovie}/> )
        const submitButton = getByRole("button", { name: /update/i})
        fireEvent.click(submitButton)

        await waitFor (() => {
            expect(updatedMovie).toBeCalledTimes(1)
        })
        

    })

    test("shouldn't trigger API request when clicked on button with empty form", async () => {
        const updatedMovie = jest.fn()
        fetch.mockImplementationOnce(JSON.stringify(empty_movie))

        const { getByRole } = render(<MovieForm movie={empty_movie} updatedMovie={updatedMovie}/> )
        const submitButton = getByRole("button", { name: /create/i})
        fireEvent.click(submitButton)

       await waitFor (() => {
        expect(updatedMovie).toBeCalledTimes(0)
       })
    })

    test("should trigger API request when clicked on new movie button", async () => {
    
        const movieCreated = jest.fn()
        fetch.mockImplementationOnce(JSON.stringify(empty_movie))

        const { getByRole } = render(<MovieForm movie={movie} movieCreated={movieCreated}/> )
        const submitButton = getByRole("button", { name: /create/i})
        
        const titleInput = screen.getByLabelText(/title/i)
        const descInput = screen.getByLabelText(/descriptiono/i)
        fireEvent.change(titleInput, { target: { value: "Title 1" }})
        fireEvent.change(descInput, { target: { value: "Description 1" }})
        
       await waitFor (() => {
         expect(movieCreated).toBeCalledWith(movie)
       })
    })


})
