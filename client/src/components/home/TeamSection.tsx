import { useTranslation } from "react-i18next";
import { Linkedin, Mail, User2 } from "lucide-react";

const TeamSection = () => {
  const { t } = useTranslation();

  const teamMembers = [
    {
      id: 1,
      name: t('team.member1.name'),
      position: t('team.member1.position'),
      expertise: t('team.member1.expertise'),
      bio: t('team.member1.bio'),
      image: '/images/team/team-member1.svg'
    },
    {
      id: 2,
      name: t('team.member2.name'),
      position: t('team.member2.position'),
      expertise: t('team.member2.expertise'),
      bio: t('team.member2.bio'),
      image: '/images/team/team-member2.svg'
    },
    {
      id: 3,
      name: t('team.member3.name'),
      position: t('team.member3.position'),
      expertise: t('team.member3.expertise'),
      bio: t('team.member3.bio'),
      image: '/images/team/team-member3.svg'
    },
    {
      id: 4,
      name: t('team.member4.name'),
      position: t('team.member4.position'),
      expertise: t('team.member4.expertise'),
      bio: t('team.member4.bio'),
      image: '/images/team/team-member4.svg'
    },
    {
      id: 5,
      name: t('team.member5.name'),
      position: t('team.member5.position'),
      expertise: t('team.member5.expertise'),
      bio: t('team.member5.bio'),
      image: '/images/team/team-member5.svg'
    }
  ];

  return (
    <section id="team" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-primary mb-4">{t('team.title')}</h2>
          <div className="w-20 h-1 bg-[#2c9c6a] mx-auto mb-6"></div>
          <p className="max-w-3xl mx-auto text-lg text-neutral">{t('team.description')}</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member) => (
            <div key={member.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <div className="h-48 w-48 rounded-full mx-auto mb-6 overflow-hidden">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-bold text-primary mb-1">{member.name}</h3>
                  <p className="text-[#2c9c6a] font-medium mb-4">{member.position}</p>
                  <p className="text-neutral text-sm mb-4">{member.expertise}</p>
                  <p className="text-neutral text-sm mb-6">{member.bio}</p>
                  <div className="flex justify-center space-x-4">
                    <a href="#" className="text-primary hover:text-[#2c9c6a] transition duration-200">
                      <Linkedin className="h-5 w-5" />
                    </a>
                    <a href="#" className="text-primary hover:text-[#2c9c6a] transition duration-200">
                      <Mail className="h-5 w-5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
