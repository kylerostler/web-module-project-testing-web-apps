import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import {getByLabelText, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// can also use fireEvent instead of userEvent for interacting with inputs and buttons etc

import ContactForm from './ContactForm';
import { wait } from '@testing-library/user-event/dist/utils';
import DisplayComponent from './DisplayComponent';

const input1 = "four";
const input2 = "testing";
const input3 = "a@a.com";


beforeEach(() => {
    render(<ContactForm />)
})

afterEach(() => {
    document.body.innerHTML = ''
})

test('renders the contact form header', ()=> {

    const header = screen.queryByText(/Contact Form/i); // using for less strict selecting not case sensitive

    expect(header).toBeInTheDocument();
    expect(header).toBeTruthy();
    expect(header).toHaveTextContent(/Contact form/i);
});

test('renders ONE error message if user enters less then 5 characters into firstname.', async () => {

    const firstName = screen.getByLabelText(/First Name*/i);

    userEvent.type(firstName, input1);

    const errorMessage = await screen.findAllByTestId('error');
    expect(errorMessage).toHaveLength(1);

});

test('renders THREE error messages if user enters no values into any fields.', async () => {

    const submitBtn = screen.getByRole("button");

    userEvent.click(submitBtn);

    await waitFor( ()=> {
        const allErrors = screen.queryAllByTestId('error');
        expect(allErrors).toHaveLength(3);
    })
});

test('renders ONE error message if user enters a valid first name and last name but no email.', async () => {
    const firstName = screen.getByLabelText(/First Name*/i);
    const lastName = screen.getByLabelText(/Last Name*/i);
    const submitBtn = screen.getByRole("button");

    userEvent.type(firstName, input2);
    userEvent.type(lastName, input2);
    userEvent.click(submitBtn);

    await waitFor( ()=> {
        const emailError = screen.queryAllByTestId('error');
        expect(emailError).toHaveLength(1);
    })
});

test('renders "email must be a valid email address" if an invalid email is entered', async () => {
    const email = screen.getByLabelText(/Email*/i);

    userEvent.type(email, input2)

    await waitFor( ()=> {
        const emailError = screen.queryByText('Error: email must be a valid email address.');
        expect(emailError).toBeInTheDocument();
    })
});

test('renders "lastName is a required field" if an last name is not entered and the submit button is clicked', async () => {
    const submitBtn = screen.getByRole("button");

    userEvent.click(submitBtn);

    await waitFor( ()=> {
        const lastNameError = screen.queryByText('Error: lastName is a required field.');
        expect(lastNameError).toBeInTheDocument();
    })
});

test('renders all firstName, lastName and email text when submitted. Does NOT render message if message is not submitted.', async () => {
    const firstName = screen.getByLabelText(/First Name*/i);
    const lastName = screen.getByLabelText(/Last Name*/i);
    const email = screen.getByLabelText(/Email*/i);
    const submitBtn = screen.getByRole("button");

    userEvent.type(firstName, 'testing1');
    userEvent.type(lastName, 'testing2');
    userEvent.type(email, 'a@a.com');
    userEvent.click(submitBtn);

    await waitFor(()=> {
        const firstNameDisplay = screen.queryByText('testing1');
        const lastNameDisplay = screen.queryByText('testing2');
        const emailDisplay = screen.queryByText('a@a.com');
        const messageDisplay = screen.queryByTestId('messageDisplay');

        expect(firstNameDisplay).toBeInTheDocument();
        expect(lastNameDisplay).toBeInTheDocument();
        expect(emailDisplay).toBeInTheDocument();
        expect(messageDisplay).not.toBeInTheDocument();
    })
});

test('renders all fields text when all fields are submitted.', async () => {

    const firstName = screen.getByLabelText(/First Name*/i);
    const lastName = screen.getByLabelText(/Last Name*/i);
    const email = screen.getByLabelText(/Email*/i);
    const submitBtn = screen.getByRole("button");
    const messageField = screen.getByLabelText(/Message/i);

    userEvent.type(firstName, 'testing1');
    userEvent.type(lastName, 'testing2');
    userEvent.type(email, 'a@a.com');
    userEvent.type(messageField, 'testing3');
    userEvent.click(submitBtn);

    await waitFor(()=> {
        const firstNameDisplay = screen.queryByText('testing1');
        const lastNameDisplay = screen.queryByText('testing2');
        const emailDisplay = screen.queryByText('a@a.com');
        const messageDisplay = screen.queryByText('testing3');

        expect(firstNameDisplay).toBeInTheDocument();
        expect(lastNameDisplay).toBeInTheDocument();
        expect(emailDisplay).toBeInTheDocument();
        expect(messageDisplay).toBeInTheDocument();
    })
    screen.debug() // for manual testing checking to see if inputs were put in
});