/* eslint-disable react-refresh/only-export-components */
import SectionWrapper from '../hoc/SectionWrapper';
import Card from '../components/Card';

const HomePage = () => {
    return (
        <div className="w-screen min-h-svh justify-center items-center flex flex-col bg-[#4F1ABE]">
            <div className="w-5/6 h-auto flex flex-row flex-wrap box-border justify-between gap-4 my-32">
                <Card
                    card_title="Card 1"
                    card_img="../assets/testing_images/pexels-1.jpg"
                    card_duration="01 Jan 2021 - 01 Jan 2022"
                ></Card>
                <Card
                    card_title="Card 2"
                    card_img="../assets/testing_images/pexels-2.jpg"
                    card_duration="01 Jan 2022 - 01 Jan 2023"
                ></Card>
                <Card
                    card_title="Card 3"
                    card_img="../assets/testing_images/pexels-3.jpg"
                    card_duration="01 Jan 2023 - 01 Jan 2024"
                ></Card>
                <Card
                    card_title="Card 2"
                    card_img="../assets/testing_images/pexels-2.jpg"
                    card_duration="01 Jan 2023 - 01 Jan 2024"
                ></Card>
                <Card
                    card_title="Card 3"
                    card_img="../assets/testing_images/pexels-3.jpg"
                    card_duration="01 Jan 2023 - 01 Jan 2024"
                ></Card>
                <Card
                    card_title="Card 1"
                    card_img="../assets/testing_images/pexels-1.jpg"
                    card_duration="01 Jan 2023 - 01 Jan 2024"
                ></Card>
            </div>
        </div>
    );
};

export default SectionWrapper(HomePage);
