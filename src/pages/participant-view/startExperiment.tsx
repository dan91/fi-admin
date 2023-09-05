import { ThemedLayoutV2, ThemedSiderV2 } from "@refinedev/antd";
import { useCreate } from "@refinedev/core";
import { Button, Card, Row, Steps } from "antd";
import { useParams } from "react-router-dom";
import { AUTH_CODES_COLLECTION } from "../../utility";
import { useEffect, useState } from "react";
import Title from "antd/es/typography/Title";


export const StartExperiment: React.FC = () => {
    const { prolificId, studyId } = useParams()

    const { mutate } = useCreate();

    const [code, setCode] = useState(0);

    const generateRandomNumber = () => {
        const randomNumber = Math.floor(1000 + Math.random() * 9000);
        return randomNumber;
    };

    if (code == 0)
        setCode(generateRandomNumber());

    useEffect(() => {

        const fifteenMinutesFromNow = () => {
            const currentDate = new Date();
            const fifteenMinutesFromNow = new Date(currentDate.getTime() + 15 * 60000);
            return fifteenMinutesFromNow;
        };

        const date = fifteenMinutesFromNow();
        console.log(code)

        mutate({
            resource: AUTH_CODES_COLLECTION,
            values: {
                prolificId: prolificId,
                code: code,
                expiryDate: date
            }
        });
    }, [])


    return code == 0
        ? (<CustomLayout>
            <Button onClick={() => setCode(generateRandomNumber())}>Generate</Button>
        </CustomLayout>)
        : (<CustomLayout>
            <Card title="Get the FeedInsights app">
                <p>Now, download the App <b>FeedInsights</b> to start the experiment.</p>
                <p><img src="/images/download_app.png" /></p>
                <p>Enter the code</p> <Title level={2}>{code}</Title>
                {/* <p>{prolificId} {studyId}</p> */}
                <Button onClick={() => setCode(generateRandomNumber())}>Generate new code</Button>
            </Card>
        </CustomLayout>);
};

const CustomLayout = (props: { children: React.ReactNode }) =>
    <ThemedLayoutV2
        Sider={() => <></>}
        children={
            <Row justify="center">
                {props.children}
            </Row>
        }
    />



