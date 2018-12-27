const AboutUs = require('./models/about-us');
const Accessory = require('./models/accessory');
const Article = require('./models/article');
const Brewer = require('./models/brewer');
const Cafe = require('./models/cafe');
const Coffee = require('./models/coffee');
const FactAboutUs = require('./models/fact-about-us');
const Grinder = require('./models/grinder');
const HeroUnit = require('./models/hero-unit');
const Home = require('./models/home');
const HostedVideo = require('./models/hosted-video');
const Office = require('./models/office');
const Tweet = require('./models/tweet');
const { DeliveryClient, TypeResolver } = require('kentico-cloud-delivery');
const projectId = '<your-project-id-here>';
const typeResolvers = [
  new TypeResolver('about_us', () => new AboutUs()),
  new TypeResolver('accessory', () => new Accessory()),
  new TypeResolver('article', () => new Article()),
  new TypeResolver('brewer', () => new Brewer()),
  new TypeResolver('cafe', () => new Cafe()),
  new TypeResolver('coffee', () => new Coffee()),
  new TypeResolver('fact_about_us', () => new FactAboutUs()),
  new TypeResolver('grinder', () => new Grinder()),
  new TypeResolver('hero_unit', () => new HeroUnit()),
  new TypeResolver('home', () => new Home()),
  new TypeResolver('hosted_video', () => new HostedVideo()),
  new TypeResolver('office', () => new Office()),
  new TypeResolver('tweet', () => new Tweet())
];

module.exports = new DeliveryClient({
  projectId: projectId,
  typeResolvers: typeResolvers
});