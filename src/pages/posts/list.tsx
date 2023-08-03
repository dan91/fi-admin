import { HttpError, IResourceComponentsProps, useList } from "@refinedev/core";
import { IPost } from "../../interfaces";
import { List, Space, Typography } from "antd";
import { DeleteButton, useSimpleList, ImageField } from "@refinedev/antd";
import { CommentOutlined, LikeOutlined, ShareAltOutlined } from "@ant-design/icons";
import { POST_COLLECTION, POST_IMAGE_BUCKET, storage } from "../../utility";
const { Text } = Typography;
export interface PostListProps extends IResourceComponentsProps {
  experimentId: string | undefined;
}
export const PostList: React.FC<PostListProps> = ({ experimentId }) => {

  const { listProps } = useSimpleList<IPost, HttpError>({
    resource: POST_COLLECTION,
    filters: {
      permanent: [
        {
          field: 'experiment_id',
          operator: 'eq',
          value: experimentId
        }
      ]
    }
  });

  const renderItem = (item: IPost) => {
    const { id, image, likes, comments, shares } = item;
    return (
      <List.Item actions={[<DeleteButton recordItemId={id} resource={POST_COLLECTION} />]}>
        <List.Item.Meta description={renderImage(image)} />
        <List.Item.Meta description={<Space><Text>{likes} <LikeOutlined /></Text> <Text>{comments} <CommentOutlined /></Text> <Text>{shares} <ShareAltOutlined /></Text></ Space>} />
      </List.Item>
    );
  };

  const renderImage = (imageId: string) => {
    return <ImageField style={{ 'padding': 10 }} width={100} value={storage.getFileView(POST_IMAGE_BUCKET, imageId).toString()} />;
  }

  return <List {...listProps} renderItem={renderItem} />;
}
