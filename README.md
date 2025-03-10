# MerchTab

A modern, responsive e-commerce frontend built with Next.js and Shopify's Storefront API. MerchTab provides a beautiful and performant shopping experience with features like real-time cart updates, product filtering, and a seamless checkout process.

## Features

- 🛍️ Modern, responsive design
- 🔍 Real-time search functionality
- 🛒 Dynamic cart management
- 🎨 Dark mode support
- ⚡ Fast page loads with Next.js
- 🔄 Real-time inventory updates
- 📱 Mobile-first approach
- 🎯 SEO optimized

## Tech Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- Shopify Storefront API
- Headless UI
- React Server Components

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- A Shopify store with Storefront API access
- npm or yarn

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/kiwihodl/merchtab.git
   cd merchtab
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up your environment variables:

   ```bash
   cp .env.example .env.local
   ```

   Then edit `.env.local` with your Shopify store details and other configuration.

4. Run the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables

Create a `.env.local` file with the following variables:

```env
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=your_storefront_access_token
SHOPIFY_REVALIDATION_SECRET=your_random_secret_string
NEXT_PUBLIC_SITE_NAME=MerchTab
NEXT_PUBLIC_SITE_URL=https://your-site-url.com
```

See `.env.example` for detailed instructions on how to obtain these values.

## Deployment

This project is optimized for deployment on Vercel:

1. Push your code to GitHub
2. Import your repository on Vercel
3. Add your environment variables in the Vercel project settings
4. Deploy!

## Contributing

We welcome contributions! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Shopify](https://www.shopify.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Headless UI](https://headlessui.dev/)
