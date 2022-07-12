import React from 'react';
import moment from 'moment';
import { Redirect } from 'react-router-dom'
import { Box, Typography } from '@mui/material';
import ShowCmts from '../UI/ShowCmts';

const ForumPost = () => {

  // API CALL
  const post = {
    title: "Job hunting sucks :(",
    author: 'Sarah Zheng',
    content: 'Velit ut cupidatat nostrud ea sunt Lorem id aliquip officia commodo nostrud commodo adipisicing. Excepteur voluptate ullamco ullamco labore ipsum minim nulla ea elit id esse minim duis. Laboris duis irure ullamco cillum. Cupidatat voluptate irure mollit pariatur consequat dolor irure exercitation ea deserunt aliqua. Do mollit occaecat ea nisi enim irure ad amet id eiusmod cillum. Cillum id ut in minim deserunt adipisicing non minim sit duis in sint proident. Laborum incididunt aute pariatur labore minim fugiat ut ullamco cupidatat laborum aliquip Lorem. \n Nulla nisi magna commodo fugiat nulla reprehenderit pariatur esse. Esse dolore ut consectetur mollit anim proident reprehenderit ad ullamco dolor nisi. Incididunt commodo dolore est duis exercitation eiusmod elit culpa ea elit. Ex laboris enim officia nostrud laborum consequat aliquip in amet excepteur aliqua pariatur Lorem ad. \n Dolore excepteur voluptate dolore sit aute voluptate ipsum anim non elit esse laboris. Ea cillum fugiat laborum aute minim proident sunt excepteur ex aute. Id laborum duis ad anim eiusmod cupidatat Lorem magna adipisicing et. Nisi amet laboris consectetur aute officia sunt nisi tempor.',
    createdAt: new Date(),
    comments: [
      {
        cmtId: "1",
        text: "Lorem ipsum dolorf sit amet, consectetur adipiscing elit. Etiam sit amet erat id est consequat fermentum. ",
        createdAt: new Date(),
        avatar:
          "https://images.unsplash.com/photo-1491308056676-205b7c9a7dc1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2073&q=80",
        username: "cmt_user1",
        reply: [
          {
            repliedId: "1",
            createdAt: new Date(),
            text: "Lorem ipsum dolorf sit amet, consectetur adipiscing elit, Lorem ipsum dolorf sit amet, consectetur adipiscing elit , Lorem ipsum dolorf sit amet, consectetur adipiscing elit  ",
            avatar:
              "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80",
            username: "reply1",
          },
        ],
      },
      {
        cmtId: "2",
        createdAt: new Date(),
        text: "Lorem ipsum dolorf sit amet, consectetur adipiscing elit. Etiam sit amet erat id est consequat fermentum. ",
        avatar:
          "https://images.unsplash.com/photo-1491308056676-205b7c9a7dc1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2073&q=80",
        username: "cmt_user2",
        reply: [],
      },
    ],
  };

  if (!post) {
    return (
      <Redirect to="/forum" />
    )
  }

  return (
    <Box>
      <PostDetails post={post} />
      <PostComments post={post} />
    </Box>
  )
}

const PostDetails = ({ post }) => (
  <>
    <Typography variant="h4" component='div' sx={{ mb: 1 }}>
      {post.title}
    </Typography>
    <Box sx={{ mb: 1 }}>
      <Typography variant='subtitle1' color="primary" component="span">
        {post.author}
      </Typography>
      {" "}
      <Typography variant="body1" component='span' sx={{ mb: 1 }}>
        {moment(post.createdAt).fromNow()}
      </Typography> 
    </Box>
    <Typography variant="body1" component='div'>
      {post.content.split('\n').map(text => (
        <p>{text}</p>
      ))}
    </Typography>
  </>
)

const PostComments = ({ post }) => (
  <>
    <Typography variant="h5" component='div' sx={{ mt: 4 }}>
      {post.comments.length} Comment(s)
    </Typography>
    <ShowCmts list={post.comments} />
  </>
)

// const CommentCard = ({ comment }) => {
//   const [replyOpen, setReplyOpen] = useState(false);

//   return (
//     <Card sx={{ mb: 2 }}>
//       <CardContent sx={{ pb: 0 }}>
//         <Box sx={{ mb: 1 }}>
//           <Typography variant='subtitle1' color="primary" component="span">
//             {comment.author}
//           </Typography>
//           {" "}
//           <Typography variant="body1" component='span' sx={{ mb: 1 }}>
//             {moment(comment.createdAt).fromNow()}
//           </Typography> 
//         </Box>
//         <Typography variant="body1" component='div'>
//           {comment.content.split('\n').map(text => (
//             <p>{text}</p>
//           ))}
//         </Typography>
//         <Link 
//           underline="none" 
//           href="#" 
//           onClick={(e) => {
//             e.preventDefault();
//             setReplyOpen(!replyOpen)
//           }}
//           sx={{ display: 'flex', alignItems: 'center '}}
//         >
//           Reply 
//           {replyOpen ? <KeyboardArrowDownIcon /> : <ChevronRight />}
//         </Link>
//         {replyOpen &&
//           <Box>
//             <TextField
//               sx={{ mt: 3 }}
//               id="reply"
//               label="Reply"
//               multiline
//               rows={2}
//               placeholder="What do you think?"
//               fullWidth
//             />
//             <Button sx={{ mt: 2, px: 5 }} variant="contained" color='primary'>
//               Post
//             </Button>
//           </Box>
//         }
//       </CardContent>
//     </Card>
//   )
// }

export default ForumPost;