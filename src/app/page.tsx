"use client";

import { useEffect, useState } from "react";
import { SessionProvider, useSession, signIn, signOut } from "next-auth/react";
import { Tweet, fetchTweets, postTweet } from "@/utils/tweetUtils";
import Image from "next/image";
import { toast } from "sonner";

// This wrapper puts useSession INSIDE SessionProvider context
function TweetApp() {
	const { data: session } = useSession();
	const [tweets, setTweets] = useState<Tweet[]>([]);
	const [content, setContent] = useState("");
	const [image, setImage] = useState<string | null>(null);
	const [posting, setPosting] = useState(false);

	useEffect(() => {
		fetchTweets().then(setTweets);
	}, []);

	const handleTweet = async () => {
		if (!content.trim() || posting) {
			toast.error("Nothing to tweet—type something!");
			return;
		}
		setPosting(true);
		try {
			const newTweet = await postTweet({ content, image });
			setTweets([newTweet, ...tweets]);
			setContent("");
			setImage(null);
			toast.success("Tweet posted!");
			// reset file input if you’re using a ref
		} catch (e) {
			toast.error("Tweet failed: " + (e as Error).message);
		} finally {
			setPosting(false);
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950 text-gray-100 flex flex-col items-center">
			<header className="py-6 text-3xl font-bold tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-600">
				Neotweet
			</header>
			<div className="w-full max-w-xl p-6 bg-white/10 rounded-2xl shadow-2xl backdrop-blur-md">
				{session ? (
					<div className="flex flex-col gap-4">
						<div className="flex items-center gap-3 mb-4">
							<span className="text-lg text-cyan-200">
								Welcome, {session.user?.name || "User"}!
							</span>
							<span className="font-semibold text-cyan-200">
								{session.user?.email || "Anonymous"}
							</span>
							<button
								onClick={() => signOut()}
								className="ml-auto px-3 py-1 bg-red-600 rounded-full text-white font-semibold shadow hover:bg-red-700 transition"
							>
								Sign Out
							</button>
						</div>
						<textarea
							className="w-full rounded-xl p-3 bg-white/20 text-black outline-none border-none focus:ring-2 focus:ring-cyan-400"
							placeholder="What's on your mind?"
							value={content}
							onChange={(e) => setContent(e.target.value)}
							rows={2}
						/>
						<input
							type="file"
							accept="image/*"
							onChange={(e) => {
								const file = e.target.files?.[0];
								if (file) {
									const reader = new FileReader();
									reader.onload = (ev) => setImage(ev.target?.result as string);
									reader.readAsDataURL(file);
								}
							}}
						/>
						<button
							onClick={handleTweet}
							className="px-4 py-2 bg-cyan-600 rounded-xl text-white font-semibold shadow hover:bg-cyan-700 transition"
						>
							Tweet
						</button>
					</div>
				) : (
					<div className="flex flex-col items-center gap-4">
						<p className="text-lg">Please sign in to post a tweet</p>
						<button
							onClick={() => signIn("google")}
							className="px-4 py-2 bg-blue-600 rounded-xl text-white font-semibold shadow hover:bg-blue-700 transition"
						>
							Sign in with Google
						</button>
					</div>
				)}
			</div>
			<div className="mt-10 w-full max-w-xl space-y-6">
				{tweets.map((tweet) => (
					<div key={tweet.id} className="p-6 bg-white/10 rounded-2xl shadow-xl">
						<div className="flex items-center gap-3 mb-2">
							<span className="font-semibold text-cyan-200">
								{tweet.userEmail}
							</span>
							<span className="text-xs text-gray-500 ml-auto">
								{new Date(tweet.createdAt).toLocaleString()}
							</span>
						</div>
						<div className="whitespace-pre-line mb-2 text-lg">
							{tweet.content}
						</div>
						{tweet.image && (
							<div
								className="relative rounded-xl max-h-80 w-full object-cover mt-2 overflow-hidden"
								style={{ height: "320px" }}
							>
								<Image
									src={tweet.image}
									alt="tweet image"
									fill
									className="object-cover rounded-xl"
									sizes="(max-width: 640px) 100vw, 600px"
									priority={false}
								/>
							</div>
						)}
					</div>
				))}
			</div>
		</div>
	);
}

// Only call useSession inside a child of <SessionProvider />
export default function Page() {
	return (
		<SessionProvider>
			<TweetApp />
		</SessionProvider>
	);
}
