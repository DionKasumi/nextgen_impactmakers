/* eslint-disable react/prop-types */
import { useState } from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { IoMdClose } from 'react-icons/io';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';

const ParticipantForm = ({ participantData, handleChange }) => {
    return (
        <>
            <Box
                component="form"
                sx={{
                    '& > :not(style)': { width: '100%', my: '7px' },
                }}
                noValidate
                autoComplete="off"
                className="w-full"
            >
                <TextField
                    type="text"
                    id="username"
                    label="Username"
                    variant="outlined"
                    required
                    name="username"
                    value={participantData.username}
                    onChange={handleChange}
                />
                <TextField
                    type="email"
                    id="email"
                    label="Email"
                    variant="outlined"
                    required
                    name="email"
                    value={participantData.email}
                    onChange={handleChange}
                />
                <TextField
                    type="text"
                    id="phone"
                    label="Phone"
                    variant="outlined"
                    required
                    name="phone"
                    value={participantData.phone}
                    onChange={handleChange}
                />
                <TextField
                    type="password"
                    id="password"
                    label="Password"
                    variant="outlined"
                    color="primary"
                    required
                    name="password"
                    value={participantData.password}
                    onChange={handleChange}
                />
            </Box>
        </>
    );
};

const OrganizationForm = ({ orgData, handleChange }) => {
    return (
        <>
            <Box
                component="form"
                sx={{
                    '& > :not(style)': { width: '100%', my: '7px' },
                }}
                noValidate
                autoComplete="off"
                className="w-full"
            >
                <TextField
                    type="text"
                    id="name_of_org"
                    label="Name Of Organization"
                    variant="outlined"
                    required
                    name="name_of_org"
                    value={orgData.name_of_org}
                    onChange={handleChange}
                />
                <TextField
                    type="email"
                    id="email_of_org"
                    label="Email"
                    variant="outlined"
                    required
                    name="email_of_org"
                    value={orgData.email_of_org}
                    onChange={handleChange}
                />
                <TextField
                    type="text"
                    id="phone_number_of_org"
                    label="Phone Number"
                    variant="outlined"
                    required
                    name="phone_number_of_org"
                    value={orgData.phone_number_of_org}
                    onChange={handleChange}
                />
                <TextField
                    type="password"
                    id="password_of_org"
                    label="Password"
                    variant="outlined"
                    required
                    name="password_of_org"
                    value={orgData.password_of_org}
                    onChange={handleChange}
                />
                <TextField
                    type="text"
                    id="url_of_org"
                    label="URL"
                    variant="outlined"
                    required
                    name="url_of_org"
                    value={orgData.url_of_org}
                    onChange={handleChange}
                />
                <TextField
                    type="text"
                    id="description_of_org"
                    label="Description"
                    variant="outlined"
                    multiline
                    maxRows={2}
                    required
                    name="description_of_org"
                />
            </Box>
        </>
    );
};

const MainForm = () => {
    const [isOrg, setOrg] = useState(false);
    const [participantData, setParticipantData] = useState({
        username: '',
        email: '',
        phone: '',
        password: '',
    });
    const [orgData, setOrgData] = useState({
        name_of_org: '',
        email_of_org: '',
        phone_number_of_org: '',
        password_of_org: '',
        url_of_org: '',
        description_of_org: '',
    });

    const handleParticipantChange = (e) => {
        setParticipantData({
            ...participantData,
            [e.target.name]: e.target.value,
        });
    };

    const handleOrgChange = (e) => {
        setOrgData({
            ...orgData,
            [e.target.name]: e.target.value,
        });
    };

    const onFormTypeChange = () => {
        setOrg(!isOrg);
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isOrg) {
                const response = await axios.post(
                    'http://localhost:8080/signup',
                    {
                        ...orgData,
                        isOrg: true,
                    }
                );
                alert(response.data.message);
            } else {
                const response = await axios.post(
                    'http://localhost:8080/signup',
                    participantData
                );
                alert(response.data.message);
            }
        } catch (error) {
            console.error(
                'Error submitting form:',
                error.response?.data || error.message
            );
            alert('Error signing up. Please try again.');
        }
    };

    return (
        <div className="w-11/12 sm:w-4/5 md:w-5/6 xl:w-5/6 h-[95%] flex justify-center items-center flex-col">
            <h2 className="text-xl md:text-2xl xl:text-3xl text-black font-bold mt-4">
                Sign Up
            </h2>
            <h2 className="text-sm md:text-base xl:text-lg text-black italic font-normal mb-1">
                Create An Account
            </h2>
            <h3 className="font-bold mb-4 text-base md:text-lg">Are you a</h3>
            <div className="flex flex-row justify-center items-center w-full md:w-2/3 lg:w-1/2 mb-4">
                <button
                    disabled={!isOrg}
                    onClick={onFormTypeChange}
                    type="button"
                    className="bg-[#4F1ABE] border-none rounded-md focus:outline-none py-2 px-4 md:px-6 text-white text-sm disabled:bg-[#8d67e0] disabled:scale-95"
                >
                    Participant
                </button>
                <p className="mx-2 text-sm md:text-base">or</p>
                <button
                    disabled={isOrg}
                    onClick={onFormTypeChange}
                    type="button"
                    className="bg-[#4F1ABE] border-none rounded-md focus:outline-none py-2 px-4 md:px-6 text-white text-sm disabled:bg-[#8d67e0] disabled:scale-95"
                >
                    Organization
                </button>
            </div>
            {!isOrg ? (
                <ParticipantForm
                    participantData={participantData}
                    handleChange={handleParticipantChange}
                />
            ) : (
                <OrganizationForm
                    orgData={orgData}
                    handleChange={handleOrgChange}
                />
            )}
            <button
                type="submit"
                onClick={onSubmit}
                className="py-2 px-16 lg:px-24 bg-[#4F1ABE] text-white flex justify-center items-center rounded-md m-auto my-4 text-sm md:text-base"
            >
                {isOrg ? 'Finish' : 'Continue'}
            </button>
        </div>
    );
};

const SignupPage = () => {
    return (
        <div className="w-screen min-h-screen h-auto flex flex-col justify-center items-center bg-[#4F1ABE]">
            <form className="w-11/12 sm:w-4/5 md:w-3/6 xl:w-2/6 h-auto flex bg-white rounded-lg flex-col justify-center items-center px-4 md:px-8">
                <MainForm />
            </form>
        </div>
    );
};

export default SignupPage;
