import { useTranslation } from "react-i18next";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { MapPin, ChevronRight } from "lucide-react";

const ProjectsSection = () => {
  const { t } = useTranslation();

  const infrastructureProjects = [
    {
      title: t('projects.infrastructure.project1.title'),
      description: t('projects.infrastructure.project1.description'),
      date: t('projects.infrastructure.project1.date'),
      location: t('projects.infrastructure.project1.location'),
      image: "https://citadelle.inchtechs.com/uploads/images/1747202957432-image-fx--12-.jpg"
    },
    {
      title: t('projects.infrastructure.project2.title'),
      description: t('projects.infrastructure.project2.description'),
      date: t('projects.infrastructure.project2.date'),
      location: t('projects.infrastructure.project2.location'),
      image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500"
    }
  ];

  const buildingProjects = [
    {
      title: t('projects.buildings.project1.title'),
      description: t('projects.buildings.project1.description'),
      date: t('projects.buildings.project1.date'),
      location: t('projects.buildings.project1.location'),
      image: "https://groupelacitadelle-sa.com/uploads/images/1747880737686-image3.png"
    },
    {
      title: t('projects.buildings.project2.title'),
      description: t('projects.buildings.project2.description'),
      date: t('projects.buildings.project2.date'),
      location: t('projects.buildings.project2.location'),
      image: "https://groupelacitadelle-sa.com/uploads/images/1748355878488-image-fx--5-.jpg"
    }
  ];
  
  const energyProjects = [
    {
      title: t('projects.energy.project1.title'),
      description: t('projects.energy.project1.description'),
      date: t('projects.energy.project1.date'),
      location: t('projects.energy.project1.location'),
      image: "https://citadelle.inchtechs.com/uploads/images/1747880744107-image4.jpg"
    }
  ];

  return (
    <section id="projects" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-primary mb-4">{t('projects.title')}</h2>
          <div className="w-20 h-1 bg-[#2c9c6a] mx-auto mb-6"></div>
          <p className="max-w-3xl mx-auto text-lg text-neutral">{t('projects.description')}</p>
        </div>
        
        <div className="space-y-16">
          {/* Infrastructure Projects */}
          <div>
            <h3 className="text-2xl font-bold text-primary mb-8">{t('projects.infrastructure.title')}</h3>
            
            <div className="grid md:grid-cols-2 gap-8">
              {infrastructureProjects.map((project, index) => (
                <div key={index}>
                  <img 
                    src={project.image}
                    alt={project.title}
                    className="w-full h-64 object-cover rounded-lg shadow-md mb-6"
                  />
                  
                  <h4 className="text-xl font-bold text-neutral mb-4">{project.title}</h4>
                  <p className="text-neutral mb-4">{project.description}</p>
                  <div className="flex items-center text-sm text-neutral">
                    <span className="bg-gray-50 rounded-full px-3 py-1 mr-2">{project.date}</span>
                    <span className="flex items-center">
                      <MapPin className="mr-1 text-[#2c9c6a] h-4 w-4" />
                      {project.location}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Building Projects */}
          <div>
            <h3 className="text-2xl font-bold text-primary mb-8">{t('projects.buildings.title')}</h3>
            
            <div className="grid md:grid-cols-2 gap-8">
              {buildingProjects.map((project, index) => (
                <div key={index}>
                  <img 
                    src={project.image}
                    alt={project.title}
                    className="w-full h-64 object-cover rounded-lg shadow-md mb-6"
                  />
                  
                  <h4 className="text-xl font-bold text-neutral mb-4">{project.title}</h4>
                  <p className="text-neutral mb-4">{project.description}</p>
                  <div className="flex items-center text-sm text-neutral">
                    <span className="bg-gray-50 rounded-full px-3 py-1 mr-2">{project.date}</span>
                    <span className="flex items-center">
                      <MapPin className="mr-1 text-[#2c9c6a] h-4 w-4" />
                      {project.location}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Energy Solutions Projects */}
          <div>
            <h3 className="text-2xl font-bold text-primary mb-8">{t('projects.energy.title')}</h3>
            
            <div className="grid md:grid-cols-2 gap-8">
              {energyProjects.map((project, index) => (
                <div key={index}>
                  <img 
                    src={project.image}
                    alt={project.title}
                    className="w-full h-64 object-cover rounded-lg shadow-md mb-6"
                  />
                  
                  <h4 className="text-xl font-bold text-neutral mb-4">{project.title}</h4>
                  <p className="text-neutral mb-4">{project.description}</p>
                  <div className="flex items-center text-sm text-neutral">
                    <span className="bg-gray-50 rounded-full px-3 py-1 mr-2">{project.date}</span>
                    <span className="flex items-center">
                      <MapPin className="mr-1 text-[#2c9c6a] h-4 w-4" />
                      {project.location}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="text-center mt-12">
          <Link href="/projects">
            <Button className="bg-primary hover:bg-primary/90 text-white font-medium py-3 px-6 rounded-md transition duration-300 inline-flex items-center">
              {t('projects.viewMore')} <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
