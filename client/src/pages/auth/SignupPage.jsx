const MainForm = () => {
    return (
        <div className="w-11/12 sm:w-4/5 md:w-5/6 xl:w-5/6 h-[95%] flex justify-center items-center flex-col">
            <h2 className="text-xl text-black font-bold mt-8">Sign Up</h2>
            <h2 className="text-sm text-black italic font-normal mb-4">
                Create An Account
            </h2>
            <h3 className="font-bold mb-4">Are you a</h3>
            <div className="flex flex-row justify-around items-center w-auto mb-6">
                <button className="bg-[#4F1ABE] border-none rounded-md focus:outline-none py-2 px-6 text-white text-sm">
                    Participant
                </button>
                <p className="mx-2">or</p>
                <button className="bg-[#4F1ABE] border-none rounded-md focus:outline-none py-2 px-6 text-white text-sm">
                    Organization
                </button>
            </div>
            <div className="flex flex-col w-full">
                <input
                    type="text"
                    name="name"
                    id="name"
                    placeholder="Name"
                    required
                    className="w-full h-auto p-4 border-[#6153CC] border-[1px] focus:outline-none invalid:border-red-500 my-2"
                />
                <input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="email@live.com"
                    required
                    className="w-full h-auto p-4 border-[#6153CC] border-[1px] focus:outline-none invalid:border-red-500 my-2"
                />
                <input
                    type="text"
                    name="phone_number"
                    id="phone_number"
                    placeholder="Phone number"
                    required
                    className="w-full h-auto p-4 border-[#6153CC] border-[1px] focus:outline-none invalid:border-red-500 my-2"
                />
                <input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="Password"
                    required
                    className="w-full h-auto p-4 border-[#6153CC] border-[1px] focus:outline-none invalid:border-red-500 my-2"
                />
            </div>
            <button
                type="button"
                className="py-2 px-12 bg-[#4F1ABE] text-white flex justify-center items-center rounded-md m-auto mb-4"
            >
                Continue
            </button>
            <div className="w-full h-max flex flex-col justify-center items-center mb-4">
                <p className="mb-4">or create account with</p>
                <div className="flex flex-row w-2/3 justify-between">
                    <img
                        src="../assets/instagram_logo.svg"
                        alt="instagram"
                        className="w-7 hover:scale-105 transition-all"
                    />
                    <img
                        src="../assets/facebook_logo.svg"
                        alt="facebook"
                        className="w-7 hover:scale-105 transition-all"
                    />
                    <img
                        src="../assets/google_logo.svg"
                        alt="google"
                        className="w-7 hover:scale-105 transition-all"
                    />
                    <img
                        src="../assets/linkedin_logo.svg"
                        alt="linkedin"
                        className="w-7 hover:scale-105 transition-all"
                    />
                </div>
            </div>
        </div>
    );
};

const SignupPage = () => {
    return (
        <div className="w-screen h-screen flex flex-col justify-center items-center bg-[#4F1ABE]">
            <form className="w-11/12 sm:w-4/5 md:w-3/6 xl:w-2/6 xl:max-w-3/6 2xl:max-w-2/6 h-[95%] flex bg-white rounded-lg flex-col justify-center items-center">
                <MainForm />
            </form>
        </div>
    );
};

export default SignupPage;
