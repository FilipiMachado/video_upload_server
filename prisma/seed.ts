import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  await prisma.prompt.deleteMany();

  await prisma.prompt.create({
    data: {
      title: "YouTube Title",
      template: `Your role is to generate three titles for a YouTube video.
    
    Below, you will receive a transcription of this video; use this transcription to generate the titles.
    Below, you will also receive a list of titles; use this list as a reference for the titles to be generated.
    
    The titles must have a maximum of 60 characters.
    The titles must be eye-catching and attractive to maximize clicks.
    
    Return ONLY the three titles in list format as in the example below:
    '''
    - Title 1
    - Title 2
    - Title 3
    '''
    
    Transcription:
    
'''
{transcription}
'''`.trim(),
    },
  });

  await prisma.prompt.create({
    data: {
      title: "YouTube Description",
      template:
        `Your role is to generate a concise description for a YouTube video.
    
    Below, you will receive a transcription of this video; use this transcription to create the description.
    
    The description should have a maximum of 80 words in the first person, containing the main points of the video.
    
    Use attention-grabbing words that captivate the reader.
    
    Additionally, at the end of the description, include a list of 3 to 10 hashtags in lowercase containing video keywords.
    
    The return should follow the following format:
    '''
    Description.
    
    #hashtag1 #hashtag2 #hashtag3 ...
    '''
    
    Transcription:
    
'''
{transcription}
'''`.trim(),
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
