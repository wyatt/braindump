import dynamic from "next/dynamic";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { useEffect, useState } from "react";
import {
  Heading,
  Tag,
  VStack,
  Text,
  Checkbox,
  Spinner,
  HStack,
  Button,
  Link,
  AlertDescription,
  AlertIcon,
  Alert,
  Flex,
  Image,
  Spacer,
} from "@chakra-ui/react";
import { MicButton } from "../lib/MicButton";
import { MdContentCopy } from "react-icons/md";
import Head from "next/head";
import GPT3Tokenizer from "gpt3-tokenizer";

const tokenizer = new GPT3Tokenizer({ type: "gpt3" });
const tokenLimit = 150;

const Index = () => {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();
  const [{ data, loading, error }, setResponse] = useState<{
    data: { tasks: string[]; journal: string } | null;
    loading: boolean;
    error: string | null;
  }>({
    data: null,
    loading: false,
    error: null,
  });
  const [input, setInput] = useState({ value: "", tokens: 0 });

  const submit = async () => {
    setResponse((prev) => ({ ...prev, loading: true, error: null }));
    await fetch("/api/transcript", {
      method: "POST",
      body: JSON.stringify({
        text: input.value,
      }),
    })
      .then((res) => {
        if (res.status >= 400) {
          throw new Error(res.status.toString());
        }
        return res.json();
      })
      .then((data) => {
        setResponse((prev) => ({ ...prev, data, loading: false }));
      })
      .catch((e) => {
        const errorMap = {
          429: "You have exceed the limit of 5 requests per hour or too many people are using the site right now. Please try again later.",
          500: "Something went wrong on our end - GPT-3 probably got a bit confused, please try again.",
        };
        setResponse((prev) => ({
          ...prev,
          error:
            e.message in errorMap
              ? errorMap[e.message as keyof typeof errorMap]
              : "Something went wrong",
          loading: false,
        }));
      });
  };

  useEffect(() => {
    if (transcript && listening) {
      const tokensInTranscript = tokenizer.encode(transcript).bpe.length;
      if (tokensInTranscript > tokenLimit) {
        SpeechRecognition.stopListening();
        return;
      }
      setInput({
        value: transcript,
        tokens: tokenizer.encode(transcript).bpe.length,
      });
    }
  }, [transcript, listening]);

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  return (
    <>
      <Head>
        <title>Brain Dump</title>
        <script
          type="text/javascript"
          src="https://cdnjs.buymeacoffee.com/1.0.0/button.prod.min.js"
          data-name="bmc-button"
          data-slug="wyattsell"
          data-color="#FFDD00"
          data-emoji=""
          data-font="Cookie"
          data-text="Buy me a coffee"
          data-outline-color="#000000"
          data-font-color="#000000"
          data-coffee-color="#ffffff"
          async
        />
      </Head>
      <VStack
        h={"min-content"}
        minH={"100vh"}
        w={"full"}
        alignItems={"center"}
        justifyContent={"space-between"}
        bg={"yellow.50"}
        paddingX={["6", "48"]}
        pt={"32"}
      >
        <Spacer flex={0} />
        <VStack flexDir={"column"} spacing={8}>
          <VStack>
            <Heading
              color={"yellow.700"}
              size={"2xl"}
              fontWeight={400}
              style={{
                textRendering: "optimizeLegibility",
              }}
            >
              Brain Dump
            </Heading>
            <Text color={"yellow.700"} textAlign={"center"} maxW={"2xl"}>
              A GPT-3 powered{" "}
              <Link
                href={
                  "https://psychcentral.com/health/using-brain-dumping-to-manage-anxiety-and-over-thinking"
                }
              >
                Braimdump
              </Link>{" "}
              tool, to help relieve stress. It will generate a to-do list and a
              helpful journal entry based on what you say.
            </Text>
          </VStack>
          <VStack>
            <MicButton listening={listening} reset={resetTranscript} />
            <Tag colorScheme={listening ? "green" : "red"} rounded={"full"}>
              {listening ? "Listening" : "Not listening"}
            </Tag>
          </VStack>
          <Flex w={["full", "auto"]} alignItems={"flex-start"} gap={2}>
            <Flex w={["fit-content", "xl"]} flexDir={"column"}>
              <Text
                border={2}
                p={2}
                borderColor={"yellow.500"}
                borderStyle={"solid"}
                bg={"white"}
                rounded={"lg"}
                color={input.value ? "yellow.800" : "gray.400"}
                w={"full"}
              >
                {input.value || "Transcript will appear here"}
              </Text>
              <Text
                fontSize={"sm"}
                color={input.tokens === tokenLimit ? "red.500" : "yellow.700"}
              >
                {tokenLimit - input.tokens} tokens left
              </Text>
            </Flex>
            <Button
              colorScheme={"yellow"}
              color={"yellow.700"}
              marginTop={"2px"}
              onClick={() => submit()}
            >
              Submit
            </Button>
          </Flex>

          <VStack pt={4} spacing={4} maxW={"container.xl"}>
            {loading && (
              <HStack>
                <Spinner />
                <Text>Thinking...</Text>
              </HStack>
            )}
            {error && (
              <Alert status="error" w={"80vw"}>
                <AlertIcon />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {data && (
              <>
                <VStack alignItems={"flex-start"} w={"full"}>
                  {data?.tasks.map((task) => (
                    <Checkbox colorScheme={"yellow"} key={task}>
                      {task}
                    </Checkbox>
                  ))}
                </VStack>
                <Text>{data?.journal}</Text>
                <HStack justifyContent={"flex-end"} w={"full"}>
                  <Button
                    variant={"outline"}
                    colorScheme={"yellow"}
                    onClick={() => {
                      resetTranscript();
                      setResponse({
                        loading: false,
                        error: null,
                        data: null,
                      });
                    }}
                  >
                    Clear
                  </Button>
                  <Button
                    colorScheme={"yellow"}
                    leftIcon={<MdContentCopy />}
                    color={"yellow.700"}
                    onClick={() => {
                      const tasks = data?.tasks
                        .map((task) => `- [ ] ${task}`)
                        .join("\n");
                      void navigator.clipboard.writeText(
                        tasks + "\n\n" + data?.journal
                      );
                    }}
                  >
                    Copy
                  </Button>
                </HStack>
              </>
            )}
          </VStack>
        </VStack>
        <HStack
          p={4}
          w={"100vw"}
          justifyContent={"space-between"}
          justifySelf={"flex-end"}
        >
          <Text fontSize={["sm", "md"]}>
            Created with ❤️ by{" "}
            <Link href={"https://wyattsell.com"}>Wyatt Sell</Link>
          </Text>
          <HStack height={"30px"}>
            <Link
              href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fwyatt%2Fbraindump&env=OPENAI_API_KEY,NEXT_PUBLIC_SPEECHLY_APP_ID&envDescription=Your%20API%20key%20for%20OpenAI%20and%20your%20Speechly%20App%20ID&envLink=https%3A%2F%2Fgithub.com%2Fwyatt%2Fbraindump%2FREADME.md&project-name=braindump&repository-name=braindump&demo-title=Brain%20Dump&demo-description=A%20GPT-3%20powered%20Braimdump%20tool%2C%20to%20help%20relieve%20stress.%20It%20will%20generate%20a%20todo%20list%20and%20a%20helpful%20journal%20entry%20based%20on%20what%20you%20say.&demo-url=https%3A%2F%2Fbraindump.wyattsell.com"
              h={"full"}
            >
              <Image
                src="https://vercel.com/button"
                alt="Deploy with Vercel"
                h={"full"}
              />
            </Link>
            <Link
              href="https://www.buymeacoffee.com/wyattsell"
              target="_blank"
              rel="noreferrer"
            >
              <Image
                src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png"
                alt="Buy Me A Coffee"
                w={"109px"}
              />
            </Link>
          </HStack>
        </HStack>
      </VStack>
    </>
  );
};

export default dynamic(() => Promise.resolve(Index), { ssr: false });
