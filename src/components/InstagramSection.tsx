import { Card, CardContent } from "@/components/ui/card";
import { Instagram, ExternalLink, Heart, MessageCircle } from "lucide-react";
import sba1 from "@/assets/images/gallery/sba1.jpeg";
import sba2 from "@/assets/images/gallery/sba2.jpeg";
import sba4 from "@/assets/images/gallery/sba4.jpeg";
import sba5 from "@/assets/images/gallery/sba5.jpeg";
import sba6 from "@/assets/images/gallery/sba6.jpeg";
import sba8 from "@/assets/images/gallery/sba8.jpeg";

interface InstagramPost {
  id: string;
  image: string;
  caption: string;
  likes: string;
  comments: string;
  date: string;
  url: string;
}

export const InstagramSection = () => {
  // Mock Instagram posts - in a real implementation, you'd fetch these from Instagram API
  const instagramPosts: InstagramPost[] = [
    {
      id: '1',
      image: sba1,
      caption: 'Empowering Black academics through networking and professional development. Join our community today! 🎓 #BlackAcademics #HigherEducation',
      likes: '127',
      comments: '23',
      date: '2024-09-20',
      url: 'https://www.instagram.com/societyofblackacademics/'
    },
    {
      id: '2',
      image: sba2,
      caption: 'Celebrating excellence in research and scholarship. Our members continue to break barriers and create change. ✨ #Research #Academic',
      likes: '89',
      comments: '15',
      date: '2024-09-18',
      url: 'https://www.instagram.com/societyofblackacademics/'
    },
    {
      id: '3',
      image: sba4,
      caption: 'Building bridges and fostering collaboration across institutions. Together we rise! 🤝 #Community #Collaboration',
      likes: '156',
      comments: '31',
      date: '2024-09-15',
      url: 'https://www.instagram.com/societyofblackacademics/'
    },
    {
      id: '4',
      image: sba5,
      caption: 'Inspiring the next generation of Black academics and scholars. The future is bright! 🌟 #NextGeneration #Inspiration',
      likes: '203',
      comments: '42',
      date: '2024-09-12',
      url: 'https://www.instagram.com/societyofblackacademics/'
    },
    {
      id: '5',
      image: sba6,
      caption: 'Knowledge sharing and mentorship at its finest. Building a stronger academic community. 📚 #Mentorship #Knowledge',
      likes: '98',
      comments: '18',
      date: '2024-09-10',
      url: 'https://www.instagram.com/societyofblackacademics/'
    },
    {
      id: '6',
      image: sba8,
      caption: 'Professional development and career advancement opportunities for our members. Always growing! 🚀 #ProfessionalDevelopment',
      likes: '134',
      comments: '27',
      date: '2024-09-08',
      url: 'https://www.instagram.com/societyofblackacademics/'
    }
  ];

  return (
    <section className="section-padding bg-gradient-to-br from-background via-primary/5 to-background">
      <div className="container-wide">
        {/* Header Section */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6">
            <Instagram className="h-4 w-4" />
            Follow Our Journey
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Latest From Instagram
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Stay connected with our community through exclusive behind-the-scenes content, 
            event highlights, and inspiring stories from our members
          </p>
        </div>

        {/* Instagram Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {instagramPosts.map((post, index) => (
            <div 
              key={post.id} 
              className="group animate-fade-in cursor-pointer"
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => window.open(post.url, '_blank')}
            >
              <Card className="card-hover overflow-hidden h-full bg-card/50 backdrop-blur-sm border-border/50 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2">
                {/* Image Container */}
                <div className="relative overflow-hidden aspect-square">
                  <img
                    src={post.image}
                    alt="Instagram post"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-4 text-white">
                      <div className="flex items-center gap-1">
                        <Heart className="h-5 w-5 fill-current" />
                        <span className="font-medium">{post.likes}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="h-5 w-5" />
                        <span className="font-medium">{post.comments}</span>
                      </div>
                    </div>
                  </div>

                  {/* Instagram Icon */}
                  <div className="absolute top-3 right-3 bg-primary/90 text-primary-foreground p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <Instagram className="h-4 w-4" />
                  </div>
                </div>

                {/* Content */}
                <CardContent className="p-4">
                  <p className="text-muted-foreground text-sm line-clamp-3 mb-3 leading-relaxed">
                    {post.caption}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{new Date(post.date).toLocaleDateString('en-GB', { 
                      day: 'numeric', 
                      month: 'short', 
                      year: 'numeric' 
                    })}</span>
                    <div className="flex items-center gap-2 text-primary group-hover:text-primary/80 transition-colors">
                      <span className="font-medium">View on Instagram</span>
                      <ExternalLink className="h-3 w-3" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center animate-fade-in bg-card/30 backdrop-blur-sm border border-border/50 rounded-3xl p-8 md:p-12" style={{ animationDelay: '0.6s' }}>
          <div className="max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Join Our Instagram Community
            </h3>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Follow us on Instagram for daily inspiration, event updates, and behind-the-scenes 
              content from the Society of Black Academics community
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="https://www.instagram.com/societyofblackacademics/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-4 rounded-full font-medium hover:from-pink-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-pink-500/25"
              >
                <Instagram className="h-5 w-5" />
                Follow @societyofblackacademics
              </a>
              <button className="inline-flex items-center gap-3 bg-card text-foreground px-8 py-4 rounded-full font-medium hover:bg-muted/50 transition-all duration-300 transform hover:scale-105 border border-border">
                <ExternalLink className="h-5 w-5" />
                Share Your Story
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};