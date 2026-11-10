import { Building2, BusFront, CarFront, FileText, HeartHandshake, PawPrint, ShieldAlert, UsersRound } from "lucide-react";
import { ComingSoonBadge } from "@/components/site/siteComponents";

const services = [
  { name: "Lost and Found", icon: HeartHandshake, description: "A planned directory for lost and found belongings." },
  { name: "Document Recovery", icon: FileText, description: "Planned information for lost IDs, papers, and travel documents." },
  { name: "Pet Recovery", icon: PawPrint, description: "A planned directory for lost and found pets." },
  { name: "Vehicle Recovery", icon: CarFront, description: "A planned reference for lost and found vehicles." },
  { name: "Community Assistance", icon: UsersRound, description: "Planned community-level recovery support." },
  { name: "Transport Lost and Found", icon: BusFront, description: "A planned directory for items left in public transportation." },
  { name: "Disaster Recovery", icon: ShieldAlert, description: "Planned recovery assistance following disasters and emergencies." },
  { name: "Organization Participation", icon: Building2, description: "A future participation pathway for authorized organizations." },
] as const;

export default function PlannedLocationServices() {
  return (
    <section className="planned-location-services" aria-labelledby="planned-location-services-title">
      <div className="planned-location-services__heading">
        <div>
          <span className="psgc-kicker">RECOVPH · FUTURE SERVICE CATEGORIES</span>
          <h2 id="planned-location-services-title">RECOVPH Services Planned for This Location</h2>
          <p>These are ideas for a future nationwide platform. None of these local services is currently operational.</p>
        </div>
        <ComingSoonBadge />
      </div>
      <div className="planned-service-grid">
        {services.map(({ name, icon: Icon, description }) => (
          <article className="planned-service-card" key={name}>
            <span className="planned-service-card__icon"><Icon size={19} strokeWidth={1.8} aria-hidden="true" /></span>
            <div><h3>{name}</h3><p>{description}</p></div>
            <ComingSoonBadge small />
          </article>
        ))}
      </div>
    </section>
  );
}
