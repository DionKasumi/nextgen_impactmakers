const MainForm = () => {
    return (
        <div className="w-11/12 sm:w-4/5 md:w-5/6 xl:w-5/6 h-[95%] flex justify-center items-center flex-col">
            <h2 className="text-xl md:text-2xl xl:text-3xl text-black font-bold mt-8">Sign Up</h2>
            <h2 className="text-sm md:text-base xl:text-lg text-black italic font-normal mb-4">
                Create An Account
            </h2>
            <h3 className="font-bold mb-4 text-base md:text-lg">Are you a</h3>
            <div className="flex flex-row justify-center items-center w-full md:w-2/3 lg:w-1/2 mb-6">
                <button className="bg-[#4F1ABE] border-none rounded-md focus:outline-none py-2 px-4 md:px-6 text-white text-sm">
                    Participant
                </button>
                <p className="mx-2 text-sm md:text-base">or</p>
                <button className="bg-[#4F1ABE] border-none rounded-md focus:outline-none py-2 px-4 md:px-6 text-white text-sm">
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
                    className="w-full h-auto p-4 md:p-5 border-[#6153CC] border-[1px] focus:outline-none invalid:border-red-500 my-2"
                />
                <input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="email@live.com"
                    required
                    className="w-full h-auto p-4 md:p-5 border-[#6153CC] border-[1px] focus:outline-none invalid:border-red-500 my-2"
                />
                <input
                    type="text"
                    name="phone_number"
                    id="phone_number"
                    placeholder="Phone number"
                    required
                    className="w-full h-auto p-4 md:p-5 border-[#6153CC] border-[1px] focus:outline-none invalid:border-red-500 my-2"
                />
                <input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="Password"
                    required
                    className="w-full h-auto p-4 md:p-5 border-[#6153CC] border-[1px] focus:outline-none invalid:border-red-500 my-2"
                />
            </div>
            <button
                type="button"
                className="py-2 px-10 md:px-16 lg:px-24 bg-[#4F1ABE] text-white flex justify-center items-center rounded-md m-auto mb-4 text-sm md:text-base"
            >
                Continue
            </button>
            <div className="w-full h-max flex flex-col justify-center items-center mb-4">
                <p className="mb-4 text-sm md:text-base">or create an account with</p>
                <div className="flex flex-row space-x-10 justify-center">
                    <img
                        src="../assets/instagram_logo.svg"
                        alt="instagram"
                        className="w-8 md:w-9 hover:scale-105 transition-all"
                    />
                    <img
                        src="../assets/facebook_logo.svg"
                        alt="facebook"
                        className="w-8 md:w-9 hover:scale-105 transition-all"
                    />
                    <img
                        src="../assets/google_logo.svg"
                        alt="google"
                        className="w-8 md:w-9 hover:scale-105 transition-all"
                    />
                    <img
                        src="../assets/linkedin_logo.svg"
                        alt="linkedin"
                        className="w-8 md:w-9 hover:scale-105 transition-all"
                    />
                </div>
            </div>
        </div>
    );
};

const SignupPage = () => {
    return (
        <div className="w-screen h-screen flex flex-col justify-center items-center bg-[#4F1ABE]">
            <form className="w-11/12 sm:w-4/5 md:w-3/5 lg:w-2/5 xl:w-1/3 2xl:w-1/4 h-auto flex bg-white rounded-lg flex-col justify-center items-center p-4 md:p-8">
                <MainForm />
            </form>
        </div>
    );
};

export default SignupPage;

