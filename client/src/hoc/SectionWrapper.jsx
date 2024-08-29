const SectionWrapper = (Component) =>
    function HOC() {
        return (
            <div className="w-screen min-h-screen flex justify-center items-center">
                <Component />
            </div>
        );
    };

export default SectionWrapper;
