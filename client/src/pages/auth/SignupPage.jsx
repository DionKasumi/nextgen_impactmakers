import { useState } from 'react';

const ParticipantForm = ({ participantData, handleChange }) => {
    return (
        <div className="flex flex-col w-full">
            <input
                type="text"
                name="name"
                id="name"
                value={participantData.name}
                onChange={handleChange}
                placeholder="Name"
                required
                className="w-full h-auto p-4 md:p-5 border-[#6153CC] border-[1px] focus:outline-none invalid:border-red-500 my-2"
            />
            <input
                type="email"
                name="email"
                id="email"
                value={participantData.email}
                onChange={handleChange}
                placeholder="email@live.com"
                required
                className="w-full h-auto p-4 md:p-5 border-[#6153CC] border-[1px] focus:outline-none invalid:border-red-500 my-2"
            />
            <input
                type="text"
                name="phone_number"
                id="phone_number"
                value={participantData.phone_number}
                onChange={handleChange}
                placeholder="Phone number"
                required
                className="w-full h-auto p-4 md:p-5 border-[#6153CC] border-[1px] focus:outline-none invalid:border-red-500 my-2"
            />
            <input
                type="password"
                name="password"
                id="password"
                value={participantData.password}
                onChange={handleChange}
                placeholder="Password"
                required
                className="w-full h-auto p-4 md:p-5 border-[#6153CC] border-[1px] focus:outline-none invalid:border-red-500 my-2"
            />
        </div>
    );
};

const OrganizationForm = ({ orgData, handleChange }) => {
    return (
        <div className="flex flex-col w-full">
            <input
                type="text"
                name="name_of_org"
                id="name_of_org"
                value={orgData.name_of_org}
                onChange={handleChange}
                placeholder="Name Of Organization"
                required
                className="w-full h-auto p-2 md:p-3 border-[#6153CC] border-[1px] focus:outline-none invalid:border-red-500 my-2"
            />
            <input
                type="email"
                name="email_of_org"
                id="email_of_org"
                value={orgData.email_of_org}
                onChange={handleChange}
                placeholder="email@live.com"
                required
                className="w-full h-auto p-2 md:p-3 border-[#6153CC] border-[1px] focus:outline-none invalid:border-red-500 my-2"
            />
            <input
                type="text"
                name="phone_number_of_org"
                id="phone_number_of_org"
                value={orgData.phone_number_of_org}
                onChange={handleChange}
                placeholder="Phone number"
                required
                className="w-full h-auto p-2 md:p-3 border-[#6153CC] border-[1px] focus:outline-none invalid:border-red-500 my-2"
            />
            <input
                type="password"
                name="password_of_org"
                id="password_of_org"
                value={orgData.password_of_org}
                onChange={handleChange}
                placeholder="Password"
                required
                className="w-full h-auto p-2 md:p-3 border-[#6153CC] border-[1px] focus:outline-none invalid:border-red-500 my-2"
            />
            <input
                type="text"
                name="url_of_org"
                id="url_of_org"
                value={orgData.url_of_org}
                onChange={handleChange}
                placeholder="Url"
                required
                className="w-full h-auto p-2 md:p-3 border-[#6153CC] border-[1px] focus:outline-none invalid:border-red-500 my-2"
            />
            <textarea
                name="description_of_org"
                id="description_of_org"
                value={orgData.description_of_org}
                onChange={handleChange}
                rows={3}
                className="w-full h-auto p-2 md:p-3 border-[#6153CC] border-[1px] focus:outline-none invalid:border-red-500 my-2 resize-none"
                required
                placeholder="A brief description of your organization..."
            ></textarea>
        </div>
    );
};

const MainForm = () => {
    const [isOrg, setOrg] = useState(false);
    const [participantData, setParticipantData] = useState({
        name: '',
        email: '',
        phone_number: '',
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

    const onSubmit = (e) => {
        e.preventDefault();
        if (isOrg) {
            console.log('Organization Data:', orgData);
        } else {
            console.log('Participant Data:', participantData);
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
