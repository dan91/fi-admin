import { Button, Empty } from "antd"

interface EmptyListProps {
    callback: () => void,
    text: string
}

export const EmptyList: React.FC<EmptyListProps> = ({ callback, text }) => {
    return <Empty

        description={
            <span>
                No {text} yet.
            </span>
        }
    >
        <Button type="primary" onClick={() => callback()}>Create Now</Button>
    </Empty>
}