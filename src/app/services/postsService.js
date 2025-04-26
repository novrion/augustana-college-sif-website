// app/services/postsService.js

/**
 * This service would normally interact with a database or API
 * For demonstration, we're using a local data store that could be
 * replaced with actual data fetching code
 */

// In-memory store for posts
let posts = [
	{
		id: "post1",
		date: "April 20, 2025",
		title: "Q1 2025 Market Recap and Fund Performance",
		author: "Alexandra Chen, President",
		authorImage: "/images/authors/alexandra.jpg",
		excerpt: "In this quarter's newsletter, we analyze our fund's performance against major indices and highlight our successful technology sector investments.",
		content: `
      <div>
        <h2>Fund Performance Overview</h2>
        <p>The Augustana Student Investment Fund outperformed the S&P 500 by 2.3% in Q1 2025, continuing our strong track record. Our technology sector overweight was the primary driver of outperformance, with our positions in semiconductor and cloud computing companies delivering exceptional returns.</p>
        
        <h2>Key Contributors and Detractors</h2>
        <p>Our top three contributors were:</p>
        <ul>
          <li><strong>Nvidia (NVDA)</strong>: +28.5% - Continued demand for AI chips and data center solutions</li>
          <li><strong>ServiceNow (NOW)</strong>: +22.3% - Strong enterprise adoption of workflow automation</li>
          <li><strong>First Solar (FSLR)</strong>: +18.7% - Benefiting from renewable energy incentives and manufacturing expansion</li>
        </ul>
        
        <p>Primary detractors included:</p>
        <ul>
          <li><strong>JPMorgan Chase (JPM)</strong>: -8.2% - Concerns about commercial real estate exposure</li>
          <li><strong>Pfizer (PFE)</strong>: -12.4% - Post-pandemic revenue normalization</li>
          <li><strong>Home Depot (HD)</strong>: -5.6% - Housing market slowdown and consumer spending shifts</li>
        </ul>
      </div>
    `,
		relatedPosts: ["post2", "post3"]
	},
	{
		id: "post2",
		date: "April 5, 2025",
		title: "Emerging Opportunities in Renewable Energy",
		author: "Marcus Lee, Sector Analyst",
		authorImage: "/images/authors/marcus.jpg",
		excerpt: "Our research team has identified promising investment opportunities in the renewable energy sector.",
		content: `
      <div>
        <h2>Sector Overview</h2>
        <p>The renewable energy sector has experienced significant growth in recent quarters, driven by supportive policy frameworks, technological advancements, and increasing cost competitiveness. Our analysis suggests that this trajectory is poised to continue, with several specific areas offering compelling investment opportunities.</p>
        
        <h2>Key Trends</h2>
        <p>Several trends are shaping the renewable energy landscape:</p>
        
        <ul>
          <li><strong>Policy Support</strong>: The Inflation Reduction Act continues to drive substantial investments in clean energy infrastructure and manufacturing</li>
          <li><strong>Storage Breakthroughs</strong>: Recent advances in battery technology are improving grid reliability and expanding applications</li>
          <li><strong>Decentralized Generation</strong>: Growth in microgrids and community solar projects is creating new business models</li>
        </ul>
      </div>
    `,
		relatedPosts: ["post1", "post3"]
	},
	{
		id: "post3",
		date: "March 22, 2025",
		title: "Interest Rate Outlook and Fixed Income Strategy",
		author: "Emily Davis, Treasurer",
		authorImage: "/images/authors/emily.jpg",
		excerpt: "This newsletter examines the Federal Reserve's recent policy decisions and their implications for fixed income markets.",
		content: `
      <div>
        <h2>Fed Policy Update</h2>
        <p>The Federal Reserve has maintained its cautious approach to monetary policy, keeping rates steady in its most recent meeting. While inflation continues to moderate, the Fed has signaled a preference for ensuring price stability before embarking on additional rate cuts.</p>
        
        <h2>Yield Curve Analysis</h2>
        <p>The yield curve has begun to normalize after a period of inversion, with the spread between 2-year and 10-year Treasury yields returning to positive territory. This development potentially signals improving market expectations for economic growth without a severe recession.</p>
        
        <h2>Portfolio Positioning</h2>
        <p>In this environment, we've adjusted our fixed income strategy to:</p>
        <ul>
          <li>Maintain a moderate duration positioning (around 5 years)</li>
          <li>Increase allocation to high-quality corporate bonds</li>
          <li>Selectively add floating rate exposure to benefit from potentially higher short-term rates</li>
        </ul>
      </div>
    `,
		relatedPosts: ["post1", "post2"]
	}
];

// Functions to interact with posts
export const getAllPosts = () => {
	return [...posts]; // Return a copy to prevent direct modification
};

export const getPostById = (id) => {
	return posts.find(post => post.id === id) || null;
};

export const getRelatedPosts = (postId) => {
	const post = getPostById(postId);
	if (!post) return [];

	return post.relatedPosts
		.map(id => getPostById(id))
		.filter(Boolean); // Filter out any null values
};

export const addPost = (newPost) => {
	// In a real app, this would create a new post in the database
	// For our demo, we're just adding to the in-memory array
	posts = [...posts, newPost];
	return newPost;
};

export const updatePost = (id, updatedPost) => {
	// In a real app, this would update the post in the database
	posts = posts.map(post => post.id === id ? { ...post, ...updatedPost } : post);
	return getPostById(id);
};

export const deletePost = (id) => {
	// In a real app, this would delete the post from the database
	const post = getPostById(id);
	posts = posts.filter(post => post.id !== id);
	return post;
};

// Example of how a new post would be added (this would be called from your admin interface)
export const createNewPost = (postData) => {
	// Generate a unique ID (in a real app, this might come from the database)
	const id = `post${Date.now()}`;

	// Create the new post object
	const newPost = {
		id,
		date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
		relatedPosts: [], // Start with no related posts
		...postData
	};

	// Add the post to our collection
	return addPost(newPost);
};